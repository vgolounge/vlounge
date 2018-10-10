<?php

namespace App\Traits;

use ReflectionClass;


trait Enum {
    /**
     * Get this enum's values as an array where keys are the const names.
     * @return array
     */
    public static function getValues() {
        $reflection = new ReflectionClass(__CLASS__);
        return $reflection->getConstants();
    }

    /**
     * Get the string name of a value.
     * @return string|null
     */
    public static function getName($value) {
        $values = self::getValues();
        foreach ($values as $name => $val) {
            if ($val == $value) {
                return $name;
            }
        }

        return null;
    }
}
