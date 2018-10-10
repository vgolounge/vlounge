<?php

namespace App;

use ReflectionClass;

class StatusCode {
    use \App\Traits\Constable;

    const OK = 1; // no error

    // 100 ~ 119 = generic internal errors
    const GENERIC_INTERNAL_ERROR = 100;
    const DATABASE_ERROR = 101;
    const NOT_FOUND = 102;
    const BAD_STATE = 103;
    const LOCKED = 104;

    // 120 ~ 129 = file/disk errors
    const CANNOT_CREATE_DIRECTORY = 120;
    const FILE_UPLOAD_ERROR = 121;
    const FILE_UPLOAD_ALREADY_EXISTS = 122;
    const CANNOT_DELETE_FILE = 123;
    const INVALID_FILE_TYPE = 124;
    
    const EMPTY = 400;

    // 7xx = client error
    const BAD_INPUT = 700;
    const BAD_REQUEST = 701;
    const RATE_LIMIT_EXCEEDED = 710;
    const CAPTCHA_INVALID = 711;

    public static function getErrorName($value) {
        $class = new ReflectionClass(__CLASS__);
        $constants = array_flip($class->getConstants());
        return $constants[$value];
    }

    /**
     * Check whether a given code is an ErrorCode.
     * @param int $code
     * @return bool
     */
    public static function isErrorCode($code) {
        $class = new ReflectionClass(__CLASS__);
        $constants = array_flip($class->getConstants());
        return array_key_exists($code, $constants);
    }

}