<?php

namespace App\Http;

use App\StatusCode;
use App\Exceptions\CurlException;
use Exception;

class CURL {

    public $timeout = 5;
    public $failOnNon200 = true;
    public $useTor = false;
    public $useProxy = false;
    public $localAddress = null;
    public $jsonStdClass = false;
    public $requestHeaders = [];
    public $requestAuth = null;
    public $requestMethod = 'GET';
    public $rejectUnauthorized = true;
    public $usePageCache = false;
    public $fromPageCache = false;
    public $disableLogging = false;
    //
    public $reqtime = null;
    public $responseHeaders = [];
    public $responseBody = null;
    public $verbose = false;
    //
    protected $ch;
    protected $executed = false;
    protected $url;
    protected $proxyInfo;

    protected static $pageCache = [];

    /**
     * Perform a GET request.
     * @param string $url
     * @param bool $json Is the response JSON?
     * @param string $body
     * @return mixed
     * @throws CurlException
     */
    public function get($url, $json = false, $body = null) {
        $cache_key = md5($url . '_json' . ($json ? '1' : '0') . '_' . ($body ?: ''));

        if ($this->usePageCache && isset(self::$pageCache[$cache_key])) {
            $this->fromPageCache = true;
            return self::$pageCache[$cache_key];
        }

        $this->setup($url);
        $this->requestMethod = 'GET';
        if (!empty($body)) {
            curl_setopt($this->ch, CURLOPT_POSTFIELDS, $body);
        }

        $res = $this->exec($json);
        if ($this->usePageCache) {
            self::$pageCache[$cache_key] = $res;
        }

        return $res;
    }

    /**
     * Perform a POST request.
     * @param string $url
     * @param array|string $form
     * @param bool $json Is the response JSON?
     * @return mixed
     * @throws CurlException
     */
    public function post($url, $form = [], $json = false) {
        $this->setup($url);
        $this->requestMethod = 'POST';

        if (is_array($form)) {
            curl_setopt($this->ch, CURLOPT_POST, true);
            curl_setopt($this->ch, CURLOPT_POSTFIELDS, http_build_query($form));
        } else {
            curl_setopt($this->ch, CURLOPT_CUSTOMREQUEST, 'POST');
            curl_setopt($this->ch, CURLOPT_POSTFIELDS, $form);
        }

        return $this->exec($json);
    }

    /**
     * Perform a PUT request.
     * @param string $url
     * @param string $body The raw body to send
     * @param bool $json Is the response JSON?
     * @return mixed
     * @throws CurlException
     */
    public function put($url, $body, $json = false) {
        $this->setup($url);
        $this->requestMethod = 'PUT';

        curl_setopt($this->ch, CURLOPT_CUSTOMREQUEST, 'PUT');
        curl_setopt($this->ch, CURLOPT_POSTFIELDS, $body);

        return $this->exec($json);
    }

    /**
     * Perform a DELETE request.
     * @param string $url
     * @param array $form
     * @param bool $json
     * @return mixed
     * @throws CurlException
     */
    public function delete($url, $form = [], $json = false) {
        $this->setup($url);
        $this->requestMethod = 'DELETE';
        curl_setopt($this->ch, CURLOPT_CUSTOMREQUEST, 'DELETE');

        if ($form !== null) {
            curl_setopt($this->ch, CURLOPT_POSTFIELDS, $form);
        }

        return $this->exec($json);
    }

    /**
     * Reset this CURL object for another request.
     */
    public function reset() {
        $this->requestHeaders = [];
        $this->requestAuth = null;
        $this->requestMethod = 'GET';
        $this->reqtime = null;
        $this->responseHeaders = [];
        $this->responseBody = null;
        $this->verbose = false;
        $this->executed = false;
        $this->url = null;
        $this->proxyInfo = null;
    }

    /**
     * Close the underlying curl handle.
     */
    public function close() {
        curl_close($this->ch);
        $this->ch = null;
    }

    /**
     * Get the HTTP response code
     * @return int
     * @throws Exception if the request hasn't been sent yet
     */
    public function getCode() {
        $this->checkSent();
        return curl_getinfo($this->ch, CURLINFO_HTTP_CODE);
    }

    /**
     * Get the CURL error code, or 0 if none.
     * @return int
     * @throws Exception if the request hasn't been sent yet
     */
    public function getCurlError() {
        $this->checkSent();
        return curl_errno($this->ch);
    }

    /**
     * Set a request header.
     * @param string $name
     * @param mixed $value
     */
    public function header($name, $value) {
        $this->requestHeaders[] = "$name: $value";
    }

    public function setAuth($username, $password) {
        $this->requestAuth = $username . ($password ? ":$password" : '');
    }

    /**
     * Make sure this CURL request has been sent.
     * @throws Exception
     */
    private function checkSent() {
        if (!$this->ch || !$this->executed) {
            throw new Exception("CURL request not sent", StatusCode::BAD_STATE);
        }
    }

    /**
     * @param string $url
     */
    private function setup($url) {
        $this->url = $url;

        if ($this->ch) {
            curl_reset($this->ch);
        } else {
            $this->ch = curl_init();
        }

        $this->fromPageCache = false;
        $this->executed = false;

        if (!app()->environment('local', 'staging') && $this->useProxy) {
            $this->setupProxy();
        }

        if (!empty($this->proxyInfo)) {
            curl_setopt($this->ch, CURLOPT_URL, 'http://' . $this->proxyInfo['req'] . ':8195/req');

            $body = ['localAddress' => $this->proxyInfo['ip'], 'url' => $this->url];

            if (!empty($this->requestHeaders)) {
                $this->requestHeaders['User-Agent'] = $this->getUserAgent();
                $body['headers'] = json_encode($this->requestHeaders);
            } else {
                $body['headers'] = json_encode(['User-Agent' => $this->getUserAgent()]);
            }

            $this->proxyInfo['body'] = $body;
        } else {
            curl_setopt($this->ch, CURLOPT_URL, $url);
            curl_setopt($this->ch, CURLOPT_USERAGENT, $this->getUserAgent());

            if (!empty($this->requestHeaders)) {
                curl_setopt($this->ch, CURLOPT_HTTPHEADER, $this->requestHeaders);
            }

            if (app()->environment('production') && $this->localAddress) {
                curl_setopt($this->ch, CURLOPT_INTERFACE, $this->localAddress);
            }
        }

        if (app()->environment('local', 'staging') || !$this->rejectUnauthorized) {
            curl_setopt($this->ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($this->ch, CURLOPT_SSL_VERIFYHOST, false);
        }

        if ($this->requestAuth) {
            curl_setopt($this->ch, CURLOPT_USERPWD, $this->requestAuth);
        }

        curl_setopt($this->ch, CURLOPT_TIMEOUT, $this->timeout);
        curl_setopt($this->ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($this->ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($this->ch, CURLOPT_HEADER, true);
        curl_setopt($this->ch, CURLOPT_SSLVERSION, 6); // TLSv1.2
    }

    /**
     * Returns a random user-agent that we can use for this request.
     * @return mixed
     */
    private function getUserAgent() {
        $ua = [
            'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.99 Safari/537.36',
            'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.103 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:46.0) Gecko/20100101 Firefox/46.0',
            'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:50.0) Gecko/20100101 Firefox/50.0'
        ];

        return $ua[rand(0, count($ua) - 1)];
    }

    /**
     * @param bool $json Is the response json?
     * @return mixed
     * @throws CurlException
     */
    private function exec($json = false) {
        $starttime = microtime(true);
        curl_setopt($this->ch, CURLOPT_VERBOSE, $this->verbose);

        if (!empty($this->proxyInfo)) {
            $this->proxyInfo['body']['method'] = $this->requestMethod;
            curl_setopt($this->ch, CURLOPT_POST, true);
            curl_setopt($this->ch, CURLOPT_POSTFIELDS, http_build_query($this->proxyInfo['body']));
        }

        $result = curl_exec($this->ch);

        $this->reqtime = microtime(true) - $starttime;
        $this->executed = true;

        /*
        if (app()->environment('production')) {
            $request_url = parse_url($this->url,PHP_URL_HOST);
            if(stristr($request_url, 'vlan.zone') ||strpos($request_url, '10.') === 0 ){
                $stat = 'opskins.curl.internal';
            }else{
                $stat = 'opskins.curl';
            }
            $datadog_tags = [
                'request_url' => (!empty($request_url) ? $request_url : ''),
                'proxy' => (empty($this->useProxy) ? 'no' : 'yes'),
                'request_method' => $this->requestMethod
                ];
            $statsd = new \DataDog\DogStatsd();
            $statsd->timing($stat, $this->reqtime, 1, $datadog_tags);
        }
        */

        $this->log($result ? strlen($result) - strpos($result, "\r\n\r\n") - 4 : 0);

        if ($result === false) {
            throw new CurlException(curl_error($this->ch) ?: "Request failed", $this->getCurlError());
        }

        if ($this->getCurlError()) {
            throw new CurlException(curl_error($this->ch), $this->getCurlError());
        }

        // Parse out the headers
        $headersize = curl_getinfo($this->ch, CURLINFO_HEADER_SIZE);
        $headers = substr($result, 0, $headersize - 4);
        $this->responseBody = substr($result, $headersize);

        // If there was a redirect involved, the headers contain both the initial redirect and the result
        $header_chunks = explode("\r\n\r\n", $headers);
        $headers = $header_chunks[count($header_chunks) - 1];
        $headers = explode("\r\n", $headers);

        $this->responseHeaders = [];
        foreach ($headers as $header) {
            $pos = strpos($header, ':');
            if ($pos === false) {
                continue;
            }

            $name = trim(strtolower(substr($header, 0, $pos)));
            $value = trim(substr($header, $pos + 1));

            if (!empty($this->responseHeaders[$name])) {
                // We already have a header by this name
                if (!is_array($this->responseHeaders[$name])) {
                    $this->responseHeaders[$name] = [$this->responseHeaders[$name]];
                }

                $this->responseHeaders[$name][] = $value;
            } else {
                $this->responseHeaders[$name] = $value;
            }
        }

        if ($this->failOnNon200 && ($this->getCode() < 200 || $this->getCode() > 299)) {
            throw new CurlException("HTTP error " . $this->getCode(), $this->getCode());
        }

        if ($json) {
            $result = json_decode($this->responseBody, !$this->jsonStdClass);
            if (json_last_error()) {
                throw new CurlException(function_exists('json_last_error_msg') ? json_last_error_msg() : 'JSON error ' . json_last_error(), json_last_error());
            }

            return $result;
        }

        return $this->responseBody;
    }

    /**
     * Log this request to file.
     * @param int $body_size
     */
    private function log($body_size = 0) {
        if ($this->disableLogging || parse_url($this->url, PHP_URL_HOST) == '127.0.0.1') {
            return;
        }

        //(new UDPLogger('curl-requests'))->info(sprintf("[%15s] %s %s [%d] [%d] [%d] [%ss]", $this->getRequestIP(), $this->requestMethod, $this->url, $this->getCode(), $this->getCurlError(), $body_size, $this->reqtime));
    }

    /**
     * @return string
     */
    private function getRequestIP() {
        if ($this->useProxy && !empty($this->proxyInfo)) {
            return $this->proxyInfo['ip'];
        }

        if ($this->useTor) {
            return 'TOR';
        }

        return $this->localAddress ?: '';
    }

    private function setupProxy() {
        if (!$this->useProxy || empty(config('app.proxy_ips'))) {
            $this->proxyInfo = null;
            return;
        }

        $keys = array_keys(config('app.proxy_ips'));
        $num = count($keys);

        $prox_key = $keys[time() % $num];
        if (is_numeric($prox_key)) {
            $proxy_ip = $proxy_request_ip = config('app.proxy_ips')[$prox_key];
        } else {
            $proxy_ip = $prox_key;
            $proxy_request_ip = config('app.proxy_ips')[$prox_key];
        }

        $this->proxyInfo = ['ip' => $proxy_ip, 'req' => $proxy_request_ip];
    }
}
