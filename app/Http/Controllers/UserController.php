<?php

namespace App\Http\Controllers;

use App\Auth;
use App\Models\User;
use App\Models\Transaction;
use App\Models\Bet;
use App\StatusCode;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class UserController extends Controller
{
	/**
	 * Get details of a user
	 * @param Request $request
	 * @return \Illuminate\Http\JsonResponse
	 * @throws \Illuminate\Validation\ValidationException
	 */
	public function GetUser(Request $request)
	{
		$this->validate($request, [
			'id' => 'int',
		]);
		
		$user = false;
		
		if((int)$request->input('id') > 0) {
			$user = User::find((int)$request->input('id'))->toArray();
		} elseif(Auth::check()) {
			$user = Auth::user()->toArray();
			$user['stats']['earnings_today'] = 0;
			$user['stats']['betrecord_today'] = null;
			$user['stats']['betlargest_today'] = 0;
			
			$earnings_today = Transaction::where('user_id', Auth::id())->where('timestamp', '>', Carbon::today())->where('type', Transaction::TYPE_BET_PAYOUT)->orderBy('credits', 'desc')->pluck('credits')->first();
			if($earnings_today) {
				$user['stats']['betrecord_today'] = $earnings_today;
			}
			
			$betrecord_today = Bet::where('user_id', Auth::id())->where('created_at', '>', Carbon::today())->orderBy('odds', 'desc')->pluck('odds')->first();
			if($betrecord_today) {
				$user['stats']['betrecord_today'] = $betrecord_today;
			}
			
			$betlargest_today = Bet::where('user_id', Auth::id())->where('created_at', '>', Carbon::today())->orderBy('amount', 'desc')->pluck('amount')->first();
			if($betlargest_today) {
				$user['stats']['betlargest_today'] = $betlargest_today;
			}
		}
			
		if($user) {
			return response()->json(
				[
					'status' => StatusCode::OK,
					'response' => ['user' => $user]
				]
			);
		} else {
			if((int)$request->input('id') > 0) {
				return response()->json(
					[
						'status' => StatusCode::GENERIC_INTERNAL_ERROR,
						'message' => 'Not found.'
					]
				);
			} else {
				return response()->json(
					[
						'status' => StatusCode::GENERIC_INTERNAL_ERROR,
						'message' => 'Not authenticated.'
					]
				);
			}
		}
	}
	
	/**
	 * Gets current credit balance
	 * @param Request $request
	 * @return \Illuminate\Http\JsonResponse
	 */
	public function GetBalance(Request $request)
	{
		$user = Auth::user();
		
		return response()->json(
			[
				'status' => StatusCode::OK,
				'response' => ['balance' => (int)$user->credits]
			]
		);
	}
	
	/**
	 * Get authenticated users transactions
	 * @param Request $request
	 * @return \Illuminate\Http\JsonResponse
	 * @throws \Illuminate\Validation\ValidationException
	 */
	public function GetTransactions(Request $request)
	{
		$this->validate($request, [
			'filter' => 'int',
			'perpage' => 'int',
			'page' => 'int'
		]);
		
		$page = (int)$request->input('page', 1);
		$limit = (int)$request->input('perpage', 5);
		$offset = $limit * ($page-1);
		
		if((int)$request->input('filter') > 0) {
			$types = [];
			switch ((int)$request->input('filter')) {
			    case 1: // Deposits
			        $types = array(1);
			        break;
			    case 2: // Withdrawals
			        $types = array(2);
			        break;
			    case 3: // Purchases
			        $types = array(3,4);
			        break;
			    case 4: // Bets
			        $types = array(5,6,7);
			        break;
			    case 5: // ?
			        $types = array(8,9);
			        break;
			    default:
			    
			}
			
			if(count($types) > 0) {
				$total = Transaction::where('user_id', Auth::id())->whereIn('type', $types)->orderBy('id', 'desc')->count();
				$transactions = Transaction::where('user_id', Auth::id())->whereIn('type', $types)->offset($offset)->limit($limit)->orderBy('id', 'desc')->get()->toArray();
			}
		} else {
			$total = Transaction::where('user_id', Auth::id())->orderBy('id', 'desc')->count();
			$transactions = Transaction::where('user_id', Auth::id())->orderBy('id', 'desc')->offset($offset)->limit($limit)->get()->toArray();
		}
		
		$pages = ceil($total / $limit);
		
		$balance = Auth::user()->credits;
		
		$transactions2 = array();
		foreach($transactions as $log) {
			$temp = $log;
			
	        $temp['type_string'] = '';
			$temp['desc'] = '';
			$temp['items'] = array();
			
			if($log['credits'] < 0) {
				$balance += abs($log['credits']);
			} else {
				$balance -= abs($log['credits']);
			}
			
			$temp['balance'] = $balance;
			
			switch ($log['type']) {
			    case Transaction::TYPE_ITEM_DEPOSIT:
			        $temp['type_string'] = 'Deposit';
					$temp['items'] = DB::table('trade_deposit')->where('user_id', $log['user_id'])->where('offer_id', $log['offer'])->get()->toArray();
			        break;
			    case Transaction::TYPE_ITEM_WITHDRAW:
			        $temp['type_string'] = 'Withdraw';
					$temp['items'] = DB::table('trade_withdraw')->where('user_id', $log['user_id'])->where('offer_id', $log['offer'])->get()->toArray();
			        break;
			    case Transaction::TYPE_STORE_BUY:
			        $temp['type_string'] = 'Purchase';
					$temp['items'] = DB::table('store_purchase')->where('user_id', $log['user_id'])->where('offer_id', $log['offer'])->get()->toArray();
			        break;
			    case Transaction::TYPE_STORE_SELL:
			        $temp['type_string'] = 'Sale';
			        break;
			    case Transaction::TYPE_BET_PLACE:
			        $temp['type_string'] = 'Bet Placed';
			        $bet = Bet::with('match')->with('definition_data')->with('pick_data')->where('id', $log['var1'])->first();
			        if($bet) {
			        	$bet->toArray();
			        }
			        $temp['desc'] = ($bet ? $bet['match']['name'] . ' (' . $bet['definition_data']['desc'] . ')' : 'Error');
			        $temp['var2'] = ($bet ? $bet['match_id'] : 0);
			        break;
			    case Transaction::TYPE_BET_CANCEL:
			        $temp['type_string'] = 'Bet Cancel';
			        $bet = Bet::with('match')->with('definition_data')->with('pick_data')->where('id', $log['var1'])->first();
			        if($bet) {
			        	$bet->toArray();
			        }
			        $temp['desc'] = ($bet ? $bet['match']['name'] . ' (' . $bet['definition_data']['desc'] . ')' : 'Error');
			        $temp['var2'] = ($bet ? $bet['match_id'] : 0);
			        break;
			    case Transaction::TYPE_BET_PAYOUT:
			        $temp['type_string'] = 'Winnings';
			        $bet = Bet::with('match')->with('definition_data')->with('pick_data')->where('id', $log['var1'])->first();
			        if($bet) {
			        	$bet->toArray();
			        }
			        $temp['desc'] = ($bet ? $bet['match']['name'] . ' (' . $bet['definition_data']['desc'] . ')' : 'Error');
			        $temp['var2'] = ($bet ? $bet['match_id'] : 0);
			        break;
			    case Transaction::TYPE_CREDIT_COMP:
			        $temp['type_string'] = 'Comp';
			        $temp['desc'] = 'Complimentary Credits';
			        break;
			    case Transaction::TYPE_CREDIT_REFUND:
			        $temp['type_string'] = 'Refund';
			        $temp['desc'] = 'Refunded Credits';
			        break;
			    default:
			        $temp['type_string'] = 'Unknown';
			}
			
			$transactions2[] = $temp;
		}
		
		return response()->json(
			[
				'status' => StatusCode::OK,
				'response' => [
					'total' => (int)$total,
					'pages' => (int)$pages,
					'transactions' => $transactions2
				]
			]
		);
	}
	
	/**
	 * Get authenticated users bets
	 * @param Request $request
	 * @return \Illuminate\Http\JsonResponse
	 * @throws \Illuminate\Validation\ValidationException
	 */
	public function GetBets(Request $request)
	{
		$this->validate($request, [
			'filter' => 'int',
			'perpage' => 'int',
			'page' => 'int',
			'search' => 'string'
		]);
		
		$page = (int)$request->input('page', 1);
		$limit = (int)$request->input('perpage', 5);
		$offset = $limit * ($page-1);
		
		if((int)$request->input('filter') > 0) {
			switch ((int)$request->input('filter')) {
			    case 1:
			        $status = 'LIVE';
			        break;
			    case 2:
			        $status = 'Upcoming';
			        break;
			    case 3:
			        $status = 'Match over';
			        break;
			    default:
			        $status = '';
			}
			
			$total = Bet::with('match')->whereHas('match', function($q) use($status, $request) {
				$q->where('status', $status);
				$q->whereRaw("UPPER(name) LIKE '%" . strtoupper(e($request->input('search'))) . "%'");
			})->with('definition_data')->with('pick_data')->where('user_id', Auth::id())->orderBy('id', 'desc')->count();
			$bets = Bet::with('match')->whereHas('match', function($q) use($status, $request) {
				$q->where('status', $status);
				$q->whereRaw("UPPER(name) LIKE '%" . strtoupper(e($request->input('search'))) . "%'");
			})->with('definition_data')->with('pick_data')->where('user_id', Auth::id())->orderBy('id', 'desc')->offset($offset)->limit($limit)->get()->toArray();
		} else {
			$total = Bet::with('match')->whereHas('match', function($q) use($request) {
				$q->whereRaw("UPPER(name) LIKE '%" . strtoupper(e($request->input('search'))) . "%'");
			})->with('definition_data')->with('pick_data')->where('user_id', Auth::id())->orderBy('id', 'desc')->count();
			$bets = Bet::with('match')->whereHas('match', function($q) use($request) {
				$q->whereRaw("UPPER(name) LIKE '%" . strtoupper(e($request->input('search'))) . "%'");
			})->with('definition_data')->with('pick_data')->where('user_id', Auth::id())->orderBy('id', 'desc')->offset($offset)->limit($limit)->get()->toArray();
		}
		
		$pages = ceil($total / $limit);
		
		$data = array();
		foreach($bets as $bet) {
			if((int)$request->input('filter') == 3) {
				$bet['payout'] = floor($bet['amount'] * $bet['odds']);
			} else {
				$bet['payout'] = null;
			}
			
			unset(
				$bet['definition_data']['user_bet'],
				$bet['definition_data']['user_bets_count'],
				$bet['definition_data']['user_bets_credits'],
				$bet['definition_data']['odds'],
				$bet['definition_data']['bets_count'],
				$bet['definition_data']['bets_credits'],
				$bet['definition_data']['bets'],
				$bet['pick_data']['user_bets'],
				$bet['pick_data']['user_bets_count'],
				$bet['pick_data']['user_bets_credits'],
				$bet['pick_data']['bets_count'],
				$bet['pick_data']['bets_credits']
			);
			
			$data[] = $bet;
		}
		
		return response()->json(
			[
				'status' => StatusCode::OK,
				'response' => [
					'total' => (int)$total,
					'pages' => (int)$pages,
					'bets' => $data
				]
			]
		);
	}
	
	public function UpdateSettings(Request $request)
	{
		return response()->json(
			[
				'status' => StatusCode::GENERIC_INTERNAL_ERROR,
				'message' => 'Not authenticated.'
			]
		);
	}
	
	/**
	 * Update trade link
	 * @param Request $request
	 * @return \Illuminate\Http\JsonResponse
	 * @throws \Illuminate\Validation\ValidationException
	 */
	public function UpdateTradeLink(Request $request)
	{
		$this->validate($request, [
			'tradelink' => 'present|nullable',
		]);
		
		$user = Auth::user();
		
		if(preg_match("/\/t\/(\d{1,})\/([\w-]{8})/si", $request->input('tradelink'), $tradelink)) {
			if(Auth::id() == $tradelink[1]) {
				$user->tradelink = config('app.opskins_trade') . "/t/" . $tradelink[1] . "/" . $tradelink[2];
				$user->save();
				
				return response()->json(
					[
						'status' => StatusCode::OK,
						'response' => ['tradelink' => $user->tradelink]
					]
				);
			} else {
				return response()->json(
					[
						'status' => StatusCode::GENERIC_INTERNAL_ERROR,
						'response' => ['tradelink' => $user->tradelink]
					]
				);
			}
		} elseif($request->input('tradelink') == "" || is_null($request->input('tradelink'))) {
			$user->tradelink = "";
			$user->save();
			
			return response()->json(
				[
					'status' => StatusCode::OK,
					'response' => ['tradelink' => '']
				]
			);
		} else {
			return response()->json(
				[
					'status' => StatusCode::GENERIC_INTERNAL_ERROR,
					'response' => ['tradelink' => $user->tradelink]
				]
			);
		}
	}
	
	/**
	 * ADMIN ONLY endpoint to adjust own credits
	 * @param Request $request
	 * @return \Illuminate\Http\JsonResponse
	 * @throws \Illuminate\Validation\ValidationException
	 */
	public function EditCredits(Request $request)
	{
		$this->validate($request, [
			'credits' => 'int|required',
		]);
		
		$user = Auth::user();
		
		$user->credits += (int)$request->input('credits');
		$user->save();
		
		// log transaction
		$log = new Transaction;
		$log->user_id = $user->id;
		$log->type = Transaction::TYPE_CREDIT_COMP;
		$log->credits = (int)$request->input('credits');
		$log->save();
		
		return response()->json(
			[
				'status' => StatusCode::OK,
				'response' => ['balance' => (int)$user->credits]
			]
		);
	}
}
