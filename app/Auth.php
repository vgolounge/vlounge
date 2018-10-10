<?php

namespace App;


use App\Models\User;

class Auth
{
    public static function login(User $user)
    {
        app('session')->regenerate(TRUE);

        app('session')->put('user_id', $user->id);
    }
    public static function logout()
    {
        app('session')->remove('user_id');
    }



    public static function id()
    {
        return app('session')->get('user_id');
    }

	public static function check()
	{
		return app('session')->has('user_id');
	}

	public static function user()
	{
	    static $user = NULL;
        if (is_null($user))
            $user = User::find(self::id());
		return $user;
	}
}