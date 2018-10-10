<?php

namespace App\Http\Controllers;

use App\Auth;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Validator;

class LoginController extends Controller
{
    private const STATE_LENGTH = 16;

    public function login(Request $request)
    {
        $client_id = env('OAUTH_CLIENT_ID');
        $secret = env('OAUTH_SECRET');
        $host = env('OAUTH_HOST');

        if(!$client_id OR !$secret OR !$host)
            dd('OAUTH_CLIENT_ID, OAUTH_SECRET and OAUTH_HOST need to be set in .env');

        if ($request->has(['state', 'code']))
        {
            $validator = Validator::make([
                'oauth_state' => $request->session()->get('oauth_state'),
                'state' => $request->input('state'),
                'code' => $request->input('code')
            ], [
                'oauth_state' => 'required|size:' . self::STATE_LENGTH,
                'state' => 'required|same:oauth_state',
                'code' => 'required|size:16',
            ]);

            if (!$validator->fails()) {
                $server_auth = base64_encode("$client_id:$secret");

                $context = stream_context_create(['http' => [
                    'method' => 'POST',
                    'header' => "Content-type: application/x-www-form-urlencoded\r\n" .
                        "Authorization: Basic $server_auth",
                    'content' => http_build_query([
                        'grant_type' => 'authorization_code',
                        'code' => $request->input('code')
                    ]),
                    'ignore_errors' => true
                ]]);

                $access_token_json = file_get_contents("$host/v1/access_token", false, $context);
                $access_token = json_decode($access_token_json);
                if ($access_token AND !property_exists($access_token, 'error'))
                {
                    $bearer_token = $access_token->access_token;
                    $refresh_token = $access_token->refresh_token;

                    $context = stream_context_create(['http' => [
                        'method' => 'GET',
                        'header' => "Authorization: Bearer $bearer_token",
                        'ignore_errors' => true
                    ]]);
                    $user_profile_json = file_get_contents(config('app.opskins_api_url') . '/IUser/GetProfile/v1/', false, $context);
                    $user_profile = json_decode($user_profile_json);

                    if ($user_profile AND property_exists($user_profile, 'status') AND $user_profile->status === 1) {
                        $user = User::firstOrNew(['id' => $user_profile->response->id]);
                        $user->fill([
                            'steam_id' => $user_profile->response->id64,
                            'name' => $user_profile->response->username,
                            'avatar' => $user_profile->response->avatar,
                            'token' => $refresh_token,
                            'ip_address' => $request->ip(),
                            'last_login_at' => Carbon::now()
                        ]);
                        if ($user->first_login_at == NULL)
                            $user->first_login_at = $user->last_login_at;
                        $user->save();

                        Auth::login($user);
                    }
                }
            }
    //        else dd($validator->failed()); //Errors

	        return redirect('/');
	        return redirect($request->session()->get('oauth_uri'));
        }
        else
        {
            $state = str_random(self::STATE_LENGTH);
            $request->session()->flash('oauth_state', $state);
            $request->session()->flash('oauth_uri', $request->server('HTTP_REFERER') != null ? $request->server('HTTP_REFERER') : '/');

            $params = http_build_query([
                'client_id' => $client_id,
                'response_type' => 'code',
                'state' => $state,
                'duration' => 'permanent'
            ]);

            return redirect("$host/v1/authorize?$params");
        }
    }

    public function logout (Request $request)
    {
        Auth::logout();
        return redirect('/');
        return redirect($request->server('HTTP_REFERER') != null ? $request->server('HTTP_REFERER') : '/');
    }

}
