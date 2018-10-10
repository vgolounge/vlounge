<?php

return [

    'name' => 'vLounge',
    'long_name' => 'vLounge',

    'url' => 'https://vlounge.gg',
    'domain' => 'vlounge.gg',
    'support_email' => 'support@vlounge.gg',
	
	'opskins_uid' => env('OPSKINS_UID'),
	'opskins_trade' => 'https://trade.'.env('OPSKINS_HOST', 'opskins.com'),
	'opskins_api_url' => 'https://api.'.env('OPSKINS_HOST', 'opskins.com'),
	'opskins_apitrade_url' => 'https://api-trade.'.env('OPSKINS_HOST', 'opskins.com'),
	'opskins_api_key' => env('OPSKINS_API_KEY'),
	'opskins_totp_secret' => env('OPSKINS_TOTP_SECRET'),

    'proxy_ips' => [
        '',
    ],

    /*
    |--------------------------------------------------------------------------
    | Encryption Key
    |--------------------------------------------------------------------------
    |
    | This key is used by the Illuminate encrypter service and should be set
    | to a random, 32 character string, otherwise these encrypted strings
    | will not be safe. Please do this before deploying an application!
    |
    */

    'key' => env('APP_KEY'),

    'cipher' => 'AES-256-CBC',

    /*
    |--------------------------------------------------------------------------
    | Application Locale Configuration
    |--------------------------------------------------------------------------
    |
    | The application locale determines the default locale that will be used
    | by the translation service provider. You are free to set this value
    | to any of the locales which will be supported by the application.
    |
    */
    'locale' => env('APP_LOCALE', 'en'),
    /*
    |--------------------------------------------------------------------------
    | Application Fallback Locale
    |--------------------------------------------------------------------------
    |
    | The fallback locale determines the locale to use when the current one
    | is not available. You may change the value to correspond to any of
    | the language folders that are provided through your application.
    |
    */
    'fallback_locale' => env('APP_FALLBACK_LOCALE', 'en'),

	'debug' => env('APP_DEBUG', true),
];
