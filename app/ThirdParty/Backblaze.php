<?php

namespace App\ThirdParty;

use App\Exceptions\BackblazeException;
use App\Http\CURL;
use Exception;
use Illuminate\Support\Facades\Cache;


class Backblaze {
    const AUTH_BASE = "https://api.backblazeb2.com";
    const TOKEN_LIFETIME = 720; // 12 hours in minutes

    const API_PATH = "/b2api/v1/";
    const PATH_CMS_SLIDER = "/frontpage/slider/";

    public $timeout = 30;
    protected $baseApi;
    protected $baseFiles;
    protected $authToken;
    protected $redisKey;

    protected $uploads = [];

    /**
     * Backblaze constructor.
     * @param string $accountId
     * @param string $appKey
     * @throws Exception
     */
    public function __construct($accountId, $appKey) {
        $auth = md5("$accountId:$appKey");
        $this->redisKey = $auth;

        if (!($auth_data = Cache::get("backblaze-auth-$auth"))) {
            $curl = new CURL();
            $curl->setAuth($accountId, $appKey);
            $curl->jsonStdClass = false;
            $res = $curl->get(self::AUTH_BASE . self::API_PATH . "b2_authorize_account", true);
            if (empty($res['authorizationToken'])) {
                throw new Exception("Cannot get authorization token from Backblaze API");
            }

            $auth_data = json_encode($res);
            Cache::put("backblaze-auth-$auth", $auth_data, self::TOKEN_LIFETIME);
        }

        $auth_data = json_decode($auth_data, true);
        $this->baseApi = $auth_data['apiUrl'] . self::API_PATH;
        $this->baseFiles = $auth_data['downloadUrl'];
        $this->authToken = $auth_data['authorizationToken'];
    }

    /**
     * Upload a file to a B2 bucket.
     * @param string $bucketId
     * @param string $filename Desired name to be stored in the bucket
     * @param string $file (Binary) string containing the actual file's contents, NOT the path to the file
     * @param array $info Info to be stored on B2's server with the file
     * @return array
     */
    public function upload($bucketId, $filename, $file, $info = []) {
        $res = $this->getUploadUrl($bucketId);

        $curl = $this->getCurl($res['authorizationToken']);
        $curl->header("X-Bz-File-Name", urlencode($filename));
        $curl->header("Content-Type", "b2/x-auto");
        $curl->header("Content-Length", strlen($file));
        $curl->header("X-Bz-Content-Sha1", sha1($file));

        foreach ($info as $key => $value) {
            $curl->header("X-Bz-Info-" . $key, urlencode($value));
        }

        $res = $curl->post($res['uploadUrl'], $file, true);
        $this->checkError($res);
        return $res;
    }

    /**
     * Get all versions of a file stored in B2.
     * @param string $bucketId
     * @param string $filename
     * @param bool $strict If false, then also return files that don't have identical filenames (searching)
     * @return array
     */
    public function getFileVersions($bucketId, $filename, $strict = true) {
        $res = $this->get("b2_list_file_versions", ['bucketId' => $bucketId, 'startFileName' => $filename]);
        if (empty($res['files'])) {
            return [];
        }

        if (!$strict) {
            return $res['files'];
        }

        $files = [];
        foreach ($res['files'] as $file) {
            if ($file['fileName'] == $filename) {
                $files[] = $file;
            }
        }

        return $files;
    }

    /**
     * Delete *all versions* of a file from B2.
     * @param string $bucketId
     * @param string $filename
     */
    public function delete($bucketId, $filename) {
        $files = $this->getFileVersions($bucketId, $filename);
        foreach ($files as $file) {
            $this->deleteFileVersion($file['fileName'], $file['fileId']);
        }
    }

    /**
     * Delete a particular file version by ID.
     * @param string $filename
     * @param string $fileId
     * @return mixed
     */
    public function deleteFileVersion($filename, $fileId) {
        return $this->post("b2_delete_file_version", ['fileName' => $filename, 'fileId' => $fileId]);
    }

    /**
     * Delete the contents of a folder, which removes the folder itself.
     * @param string $bucketId
     * @param string $filename Path of folder
     * @return array Files that were deleted
     */
    public function deleteFolder($bucketId, $filename) {
        if (substr($filename, strlen($filename) - 1) != '/') {
            $filename .= '/';
        }

        $versions = $this->getFileVersions($bucketId, $filename, false);
        $files = [];
        foreach ($versions as $file) {
            if (strpos($file['fileName'], $filename) === 0) {
                $files[] = $file;
                $this->deleteFileVersion($file['fileName'], $file['fileId']);
            }
        }

        return $files;
    }

    /**
     * @param string $bucketId
     * @param string $filenamePrefix All files *beginning* with this filename will be accessible
     * @param int $duration Duration for which the authorization should be valid, in seconds
     * @return array
     */
    public function getDownloadAuth($bucketId, $filenamePrefix, $duration) {
        $res = $this->get("/b2_get_download_authorization", ['bucketId' => $bucketId, 'fileNamePrefix' => $filenamePrefix, 'validDurationInSeconds' => $duration]);
        $res['baseUrl'] = $this->baseFiles . '/file/';
        return $res;
    }

    /**
     * Download a file from B2.
     * @param string $bucketName
     * @param string $filename
     * @return array
     */
    public function download($bucketName, $filename) {
        $curl = $this->getCurl();
        $curl->timeout = 5;
        $file = $this->get('/file/' . $bucketName . '/' . $filename, [], $this->baseFiles, $curl, false);

        $output = [
            'type' => $curl->responseHeaders['content-type'],
            'fileId' => $curl->responseHeaders['x-bz-file-id'],
            'uploadTime' => floor($curl->responseHeaders['x-bz-upload-timestamp'] / 1000),
            'contentSha1' => $curl->responseHeaders['x-bz-content-sha1'],
            'metadata' => [],
            'content' => $file
        ];

        foreach ($curl->responseHeaders as $key => $value) {
            if (strpos($key, 'x-bz-info-') === 0) {
                $output['metadata'][substr($key, 10)] = $value;
            }
        }

        return $output;
    }

    protected function getUploadUrl($bucketId) {
        if (!empty($this->uploads[$bucketId])) {
            return $this->uploads[$bucketId];
        }

        $res = $this->post("b2_get_upload_url", ['bucketId' => $bucketId]);
        if (empty($res['uploadUrl']) || empty($res['authorizationToken'])) {
            throw new Exception("B2 did not give us an upload URL or auth token");
        }

        $this->uploads[$bucketId] = $res;
        return $res;
    }

    protected function get($endpoint, $data = [], $base = null, $curl = null, $json = true) {
        if (!$curl) {
            $curl = $this->getCurl();
        }

        $res = $curl->get(($base ?: $this->baseApi) . $endpoint . (!empty($data) ? '?' . http_build_query($data) : ''), $json);
        $this->checkError($res);
        return $res;
    }

    protected function post($endpoint, $data = [], $base = null, $curl = null) {
        if (!$curl) {
            $curl = $this->getCurl();
        }

        $res = $curl->post(($base ?: $this->baseApi) . $endpoint, json_encode($data), true);
        $this->checkError($res);
        return $res;
    }

    protected function getCurl($auth = null) {
        $curl = new CURL();
        $curl->header("Authorization", $auth ?: $this->authToken);
        $curl->jsonStdClass = false;
        $curl->failOnNon200 = false;
        $curl->timeout = $this->timeout;
        return $curl;
    }

    protected function checkError($res) {

        if (is_string($res)) {
            $res = json_decode($res, true);
            if (!$res) {
                // Not an error, I hope
                return;
            }
        }

        if (!empty($res['status']) && $res['status'] == 401) {
            Cache::forget($this->redisKey);
        }

        if (!empty($res['status']) && !empty($res['code']) && !empty($res['message'])) {
            throw new BackblazeException($res['message'], $res['status'], $res['code']);
        }
    }
}
