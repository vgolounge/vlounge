<?php

namespace App\Exceptions;

use Exception;

class BackblazeException extends Exception {
    public $bbCode;

    public function __construct($message = "", $code = "", $bbCode = "") {
        parent::__construct($message, $code);
        $this->bbCode = $bbCode;
    }

    public function getBbCode() {
        return $this->bbCode;
    }
}
