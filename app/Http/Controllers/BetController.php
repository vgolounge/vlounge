<?php

namespace App\Http\Controllers;

use App\Auth;
use App\Betting;
use App\Events\BetCanceledEvent;
use App\Events\BetPlacedEvent;
use App\Models\Bet;
use App\StatusCode;
use Illuminate\Http\Request;

class BetController extends Controller
{
	/**
	 * Get bet by ID
	 * @param Request $request
	 * @return \Illuminate\Http\JsonResponse
	 * @throws \Illuminate\Validation\ValidationException
	 */
	public function GetBet(Request $request)
	{
		$this->validate($request, [
			'id' => 'required|int',
		]);
		
		$bet = Bet::find((int)$request->input('id'));

        return response()->json(
            [
                'status' => StatusCode::OK,
                'response' => ['bet' => $bet->toArray()]
            ]
        );
	}
	
	/**
	 * Place a bet
	 * @param Request $request
	 * @return \Illuminate\Http\JsonResponse
	 * @throws \Illuminate\Validation\ValidationException
	 */
	public function PlaceBet(Request $request)
	{
		if(Auth::check()) {
			$this->validate($request, [
				'definition' => 'required|int',
				'amount' => 'required|int',
				'pick' => 'int',
			]);
			
			$req = Betting::place(
				(int)$request->input('definition'),
				Auth::id(),
				(int)$request->input('amount'),
				(int)$request->input('pick')
			);
			
			if((int)$req > 0) {
				$bet = Bet::find((int)$req);

				event(new BetPlacedEvent($bet));
				
				return response()->json(
					[
						'status' => StatusCode::OK,
						'response' => [
						    'bet' => $bet->toArray(),
                            'credits' => Auth::user()->credits
                        ]
					]
				);
			} else {
				return response()->json(
					[
						'status' => StatusCode::GENERIC_INTERNAL_ERROR,
						'message' => 'Error.'
					]
				);
			}
		} else {
			return response()->json(
				[
					'status' => StatusCode::GENERIC_INTERNAL_ERROR,
					'message' => 'Not authenticated.'
				]
			);
		}
	}
	
	/**
	 * Cancel a bet
	 * @param Request $request
	 * @return \Illuminate\Http\JsonResponse
	 * @throws \Illuminate\Validation\ValidationException
	 */
	public function CancelBet(Request $request)
	{
		if(Auth::check()) {
			$this->validate($request, [
				'bet_id' => 'required|int',
			]);
			
			$req = Betting::cancel(
				(int)$request->input('bet_id'),
				Auth::id()
			);
			
			if((int)$req > 0) {
				$bet = Bet::find((int)$req);

                event(new BetCanceledEvent($bet));

				return response()->json(
					[
						'status' => StatusCode::OK,
						'response' => [
						    'bet' => $bet->toArray(),
                            'credits' => Auth::user()->credits
                        ]
					]
				);
			} else {
				return response()->json(
					[
						'status' => StatusCode::GENERIC_INTERNAL_ERROR,
						'message' => 'Error.'
					]
				);
			}
		} else {
			return response()->json(
				[
					'status' => StatusCode::GENERIC_INTERNAL_ERROR,
					'message' => 'Not authenticated.'
				]
			);
		}
	}
	
	/**
	 * Edit a bet
	 * @param Request $request
	 * @return \Illuminate\Http\JsonResponse
	 * @throws \Illuminate\Validation\ValidationException
	 */
	public function EditBet(Request $request)
	{
		if(Auth::check()) {
			$this->validate($request, [
				'bet_id' => 'required|int',
				'amount' => 'int',
				'pick' => 'int',
			]);
			
			$amount = null;
			$pick = null;
			
			if($request->input('amount')) $amount = (int)$request->input('amount');
			if($request->input('pick')) $pick = (int)$request->input('pick');
			
			$req = Betting::edit(
				(int)$request->input('bet_id'),
				Auth::id(),
				$amount,
				$pick
			);
			
			if((int)$req > 0) {
				$bet = Bet::find((int)$req);
				
				return response()->json(
					[
						'status' => StatusCode::OK,
						'response' => ['bet' => $bet->toArray()]
					]
				);
			} else {
				return response()->json(
					[
						'status' => StatusCode::GENERIC_INTERNAL_ERROR,
						'message' => 'Error.'
					]
				);
			}
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
