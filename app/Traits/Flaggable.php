<?php

namespace App\Traits;

use ReflectionClass;


/**
 * Class Flaggable
 * Only works if the object has a "flags" property.
 * @package Core\Traits
 */
trait Flaggable {


    /**
     * @return array Keys are flag numbers, values are names
     */
    public static function getAvailableFlags() {
        $reflection = new ReflectionClass(__CLASS__);
        $consts = $reflection->getConstants();
        $flags = [];

        foreach ($consts as $name => $value) {
            if (strpos($name, 'FLAG_') === 0) {
                $flags[$value] = substr($name, 5);
            }
        }

        return $flags;
    }

    public static function getEditableStatus($onlyEditable = true){
        $arr = [];
        $flags = self::getAvailableFlags();
        foreach ($flags as $flag => $name){
            if (self::canEditFlag($flag) == $onlyEditable) {
                $arr[$flag] = $name;
            }
        }
        return $arr;
    }

    public static function canEditFlag($flag){
        if(empty(self::$uneditableFlags)){
            return true;
        }
        if(in_array($flag, self::$uneditableFlags)) {
            return false;
        }
        return true;
    }

    /**
     * @param int $flag
     * @return bool
     */
    public function hasFlag($flag) {
        return ($this->_getFlags() & $flag) == $flag;
    }

    /**
     * @param int $flag
     * @return bool false if we already had the flag
     */
    public function addFlag($flag) {
        if(!isset($this->flags)){
            $this->flags = 0;
        }
        if ($this->hasFlag($flag)) {
            return false;
        }

        $this->flags |= $flag;
        return true;
    }

    /**
     * @param int $flag
     * @return bool false if we didn't have the flag
     */
    public function removeFlag($flag) {
        if (!$this->hasFlag($flag)) {
            return false;
        }

        $this->flags &= ~$flag;
        return true;
    }

    /**
     * If we have a flag, removes it. If we don't, adds it.
     * @param int $flag
     * @return bool true if we added the flag, false if we removed it
     */
    public function changeFlag($flag) {
        if (!$this->hasFlag($flag)) {
            $this->addFlag($flag);
            return true;
        } else {
            $this->removeFlag($flag);
            return false;
        }
    }

    /**
     * Alias of changeFlag
     * @param int $flag
     * @return bool true if we added the flag, false if we removed it
     */
    public function flipFlag($flag) {
        return $this->changeFlag($flag);
    }

    /**
     * Set a flag to a specific state.
     * @param int $flag
     * @param bool $on
     * @return bool true if the flag changed, false if not
     */
    public function setFlag($flag, $on) {
        if ($on) {
            return $this->addFlag($flag);
        } else {
            return $this->removeFlag($flag);
        }
    }

    /**
     * @return array Flags we have, in no particular order, with keys being flag ints and values being string names (without FLAG_).
     */
    public function getFlags() {
        $flags = static::getAvailableFlags();
        $myFlags = [];

        foreach ($flags as $flag => $name) {
            if ($this->hasFlag($flag)) {
                $myFlags[$flag] = $name;
            }
        }

        return $myFlags;
    }

    private function _getFlags() {
        return (int) $this->flags;
    }

}
