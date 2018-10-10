<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$router->get('/', [
    'as' => 'home',
    'uses' => 'HomeController@index'
]);
$router->get('/about', [
    'as' => 'home',
    'uses' => 'HomeController@index'
]);

$router->get('/upcoming', [
    'as' => 'home',
    'uses' => 'HomeController@index'
]);
$router->get('/pastmatches', [
    'as' => 'home',
    'uses' => 'HomeController@index'
]);
$router->get('/match/{id}', [
    'as' => 'home',
    'uses' => 'HomeController@index'
]);
$router->group(['prefix' => 'account', 'middleware' => 'auth'], function() use ($router) {
	$router->get('/', ['as' => 'home', 'uses' => 'HomeController@index']);
	$router->get('/bets', ['as' => 'home', 'uses' => 'HomeController@index']);
	$router->get('/transactions', ['as' => 'home', 'uses' => 'HomeController@index']);
	$router->get('/deposit', ['as' => 'home', 'uses' => 'HomeController@index']);
	$router->get('/pending', ['as' => 'home', 'uses' => 'HomeController@index']);
});
$router->get('/store', [
    'as' => 'home',
    'uses' => 'HomeController@index'
]);
$router->get('/login', [
    'as' => 'login',
    'middleware' => 'guest',
    'uses' => 'LoginController@login'
]);
$router->get('/logout', [
    'as' => 'logout',
    'uses' => 'LoginController@logout'
]);

$router->get('/team_logo/{team_id}', [
    'as' => 'team_logo',
    'uses' => 'HomeController@team_logo'
]);

$router->group(['prefix' => 'api'], function() use ($router) {
	$router->group(['prefix' => 'Trade'], function() use ($router) {
	    $router->get('/GetUserPending', ['middleware' => 'auth_api', 'uses' => 'TradeController@GetUserPending']);
	    $router->get('/GetUserItems', ['middleware' => 'auth_api', 'uses' => 'TradeController@GetUserItems']);
	    $router->get('/GetSiteItems', ['uses' => 'TradeController@GetSiteItems']);
	    $router->post('/ItemDeposit', ['middleware' => 'auth_api', 'uses' => 'TradeController@ItemDeposit']);
	    $router->post('/ItemWithdraw', ['middleware' => 'auth_api', 'uses' => 'TradeController@ItemWithdraw']);
	    $router->get('/CheckOffers', ['middleware' => 'admin', 'uses' => 'TradeController@CheckOffers']);
	});
	
	$router->group(['prefix' => 'Store'], function() use ($router) {
	    $router->post('/BuyItem', ['middleware' => 'auth_api', 'uses' => 'StoreController@BuyItem']);
	});
	
	$router->group(['prefix' => 'Bet', 'middleware' => 'auth_api'], function() use ($router) {
	    $router->get('/GetBet', ['uses' => 'BetController@GetBet']);
	    $router->post('/PlaceBet', ['uses' => 'BetController@PlaceBet']);
	    //$router->post('/CancelBet', ['middleware' => 'admin', 'uses' => 'BetController@CancelBet']);
	    //$router->post('/EditBet', ['middleware' => 'admin', 'uses' => 'BetController@EditBet']);
	});
	
	$router->group(['prefix' => 'User'], function() use ($router) {
	    $router->get('/GetUser', ['uses' => 'UserController@GetUser']);
	    $router->get('/GetBalance', ['middleware' => 'auth_api', 'uses' => 'UserController@GetBalance']);
	    $router->get('/GetTransactions', ['middleware' => 'auth_api', 'uses' => 'UserController@GetTransactions']);
	    $router->get('/GetBets', ['middleware' => 'auth_api', 'uses' => 'UserController@GetBets']);
	    $router->post('/UpdateTradeLink', ['middleware' => 'auth_api', 'uses' => 'UserController@UpdateTradeLink']);
	    $router->get('/EditCredits', ['middleware' => 'admin', 'uses' => 'UserController@EditCredits']);
	});
	
	$router->group(['prefix' => 'Matches'], function() use ($router) {
	    $router->get('/UpcomingMatches',['uses'=>'MatchesController@GetUpcomingMatches']);
	    $router->get('/PastMatches', ['uses' => 'MatchesController@GetPastMatches']);
	    $router->get('/LiveMatches',['uses'=>'MatchesController@GetLiveMatches']);
	    $router->get('/GetMatchDetails', ['uses' => 'MatchesController@GetMatchDetails']);
	    $router->get('/GetScoreCard', ['uses' => 'MatchesController@GetScoreCard']);
	    $router->get('/GetBettingData', ['uses' => 'MatchesController@GetBettingData']);
	});
});

$router->group(['prefix' => 'dashboard', 'middleware' => 'admin'], function() use ($router) {
    $router->get('/',[
        'uses'=>'AdminController@index',
        'as' => 'admin'
    ]);
    $router->get('/inventory',[
        'uses'=>'AdminController@inventory',
        'as' => 'admin.inventory'
    ]);

    $router->group(['prefix' => 'settings'], function() use ($router) {
        $router->get('/', [
            'uses' => 'AdminController@settings',
            'as' => 'admin.settings'
        ]);
        $router->post('/save', [
            'uses' => 'AdminController@settingsSave',
            'as' => 'admin.settings.save'
        ]);
    });

    $router->group(['prefix' => 'users'], function() use ($router) {
        $router->get('/', [
            'uses' => 'AdminController@users',
            'as' => 'admin.users'
        ]);
        $router->post('/filter', [
            'uses' => 'AdminController@usersFilter',
            'as' => 'admin.users.filter'
        ]);
        $router->post('/save', [
            'uses' => 'AdminController@usersSave',
            'as' => 'admin.users.save'
        ]);
    });

    $router->group(['prefix' => 'bet-templates'], function() use ($router) {
        $router->get('/', [
            'uses' => 'AdminController@betTemplates',
            'as' => 'admin.bet-templates'
        ]);
        $router->post('/filter', [
            'uses' => 'AdminController@betTemplatesFilter',
            'as' => 'admin.bet-templates.filter'
        ]);
        $router->post('/save', [
            'uses' => 'AdminController@betTemplatesSave',
            'as' => 'admin.bet-templates.save'
        ]);
    });
    $router->group(['prefix' => 'matches'], function() use ($router) {
        $router->get('/', [
            'uses' => 'AdminController@matches',
            'as' => 'admin.matches'
        ]);
        $router->post('/filter', [
            'uses' => 'AdminController@matchesFilter',
            'as' => 'admin.matches.filter'
        ]);
        $router->post('/save', [
            'uses' => 'AdminController@matchesSave',
            'as' => 'admin.matches.save'
        ]);
        $router->post('/return', [
            'uses' => 'AdminController@matchesReturnBets',
            'as' => 'admin.matches.return'
        ]);
    });

    $router->get('transactions-{type:deposit|withdraw}', [
        'uses' => 'AdminController@transactions',
        'as' => 'admin.transactions'
    ]);
    $router->post('transactions/filter', [
        'uses' => 'AdminController@transactionsFilter',
        'as' => 'admin.transactions.filter'
    ]);
});
