<?php

namespace App\Traits;

use App\Enums\EConstFormat;
use ReflectionClass;

/**
 * Not a British police officer.
 * For consts like TYPE_, STATE_, STATUS_, that kind of thing.
 * @package Core\Traits
 */
trait Constable {
    private static $available_consts = [];

    /**
     * @param string $const_type Can be empty to get all consts
     * @param bool $flip If true, return array with keys being names and values being ints
     * @return array Keys are const numbers, values are names
     */
    public static function getAvailableConsts($const_type, $flip = false) {
        $cache_key = $const_type . ($flip ? '_flipped' : '');
        if (isset(static::$available_consts[$cache_key])) {
            return static::$available_consts[$cache_key];
        }

        $reflection = new ReflectionClass(__CLASS__);
        $consts = $reflection->getConstants();
        $flags = [];

        $prefix = strlen($const_type) > 0 ? strtoupper($const_type) . '_' : '';
        $prefix_length = strlen($prefix);

        foreach ($consts as $name => $value) {
            if ($prefix_length == 0 || strpos($name, $prefix) === 0) {
                $flags[$value] = substr($name, $prefix_length);
            }
        }

        if ($flip) {
            $flags = array_map(function($val) { return (int) $val; }, array_flip($flags));
        }

        static::$available_consts[$cache_key] = $flags;
        return $flags;
    }

    /**
     * Check if a given value is associated with a valid const.
     * @param string $const_type
     * @param int $const_value
     * @return bool
     */
    public static function isValidConst($const_type, $const_value) {
        return isset(self::getAvailableConsts($const_type)[$const_value]);
    }

    /**
     * @param string $const_type
     * @param int $const_value
     * @param int $format One or more values from EConstFormat
     * @return string|int Returns the value passed in if not found.
     */
    public static function getConstName($const_type, $const_value, $format = EConstFormat::NONE) {
        $consts = static::getAvailableConsts($const_type);
        if (isset($consts[$const_value])) {
            return self::formatConst($consts[$const_value], $format);
        }

        return $const_value;
    }

    /**
     * @param string $str
     * @param int $format
     * @return string
     */
    public static function formatConst($str, $format = EConstFormat::NONE) {
        if ($format == EConstFormat::NONE) {
            return $str;
        }

        if ($format & EConstFormat::SPACES) {
            $str = str_replace('_', ' ', $str);
        }

        if ($format & EConstFormat::LOWERCASE) {
            $str = strtolower($str);
        }

        if ($format & EConstFormat::UPPERCASE_FIRST) {
            $str = ucfirst($str);
        }

        if ($format & EConstFormat::TITLE_CASE) {
            $str = ucwords($str);
        }

        return $str;
    }

    /**
     * Generate a MySQL CASE statement for use in a query that will replace a particular column which is of type int
     * representing values from a const, into strings for the names of those values.
     * @param string $const_type
     * @param string $col_name
     * @return string
     */
    public static function constToMySQLCase($const_type, $col_name) {
        $sql = 'CASE ';
        $consts = self::getAvailableConsts($const_type);
        foreach ($consts as $int => $name){
            $sql .= "WHEN $col_name = $int THEN \"$name\" ";
        }
        $sql .= "ELSE \"UNKNOWN\" END AS `$col_name`";
        return $sql;
    }
}
