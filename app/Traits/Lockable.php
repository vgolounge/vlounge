<?php

namespace App\Traits;


/**
 * Class Lockable
 * Class requires a static $table or $locktype string
 * @package Core\Traits
 */
trait Lockable {
    /**
     * Get a lock for this object in Redis. Returns false if lock was not acquired.
     * @param int $duration Time in seconds this lock should expire after if we crash and don't release it
     * @param string $type
     * @param bool $renew Set to true if you already hold the lock but you need to renew it
     * @return bool
     */
    public function takeLock($duration = 60, $type = 'action', $renew = false) {
        global $redis;

        // http://redis.io/commands/setnx has a good locking algorithm

        $acquired = $redis->setnx($this->getLockKeyName($type), time() . '-' . $_SERVER['SCRIPT_NAME']);
        if ($acquired || $renew) {
            $redis->expire($this->getLockKeyName($type), $duration + 1);
            return true;
        }

        return false;
    }

    /**
     * Release our lock so other requests can take it. Returns false if the lock was expired.
     * @param string $type
     * @return bool
     */
    public function releaseLock($type = 'action') {
        global $redis;
        return !!$redis->del($this->getLockKeyName($type));
    }

    /**
     * Checks if this object is currently locked. Don't use this if you want to take a lock, use takeLock instead.
     * @param string $type
     * @return bool
     */
    public function isLocked($type = 'action') {
        global $redis;
        return $redis->get($this->getLockKeyName($type)) !== null;
    }

    private function getLockObjectId() {
        if (!empty($this->id)) {
            return $this->id;
        }

        return $this->id64;
    }

    private function getLockKeyName($type) {
        $locktype = self::getLockName();
        $objectid = $this->getLockObjectId();
        return "lock-$locktype-$type-$objectid";
    }

    private static function getLockName() {
        if (!empty(static::$locktype)) {
            return static::$locktype;
        }

        return static::$table;
    }
}
