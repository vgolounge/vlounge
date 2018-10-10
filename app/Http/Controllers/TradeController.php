<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Auth;
use App\Trade;
use App\StatusCode;

class TradeController extends Controller
{
	// temp
	public function CheckOffers(Request $request)
	{
		return response()->json(
			[
				'status' => StatusCode::OK,
				'response' => Trade::checkOffers()
			]
		);
	}
	
	/**
	 * Returns array of filters that can be applied
	 * @param array $items
	 * @return array
	 */
	private function GetFilters(Array $items)
	{
		$wear_tier_index_map = array(
            0 => '',
	        1 => 'Factory New',
	        2 => 'Minimal Wear',
	        3 => 'Field-Tested',
	        4 => 'Well-Worn',
	        5 => 'Battle-Scarred'
        );
        
        $filter_type    = array();
        $filter_rarity  = array();
        $filter_wear    = array();
        $filter_price   = array();
        
        foreach($items as $item) {
            $filter_type[]      = $item['type'];
            $filter_rarity[]    = $item['rarity'];
            $filter_price[]     = $item['credits'];
            $filter_wear[$item['wear_tier_index']] = $wear_tier_index_map[$item['wear_tier_index']];
        }
        
        $filter_type    = array_unique($filter_type);
        $filter_rarity  = array_unique($filter_rarity);
        $filter_wear    = array_unique($filter_wear);
        
        $filter_type    = array_values($filter_type);
        $filter_rarity  = array_values($filter_rarity);
        
        $filter_price_min   = min($filter_price);
        $filter_price_max   = max($filter_price);
        
        $filters = array(
	        'type' => $filter_type,
            'rarity' => $filter_rarity,
	        'wear' => $filter_wear,
	        'price' => [$filter_price_min, $filter_price_max]
        );
        
        return $filters;
	}
	
	/**
	 * Returns array of authenticated users pending withdrawals
	 * @param Request $request
	 * @return \Illuminate\Http\JsonResponse
	 */
	public function GetUserPending(Request $request)
	{
		$items = Trade::getUserPending(Auth::id(), $request->input('appid'));
		
		if(!empty($items)) {
			$filters = $this->GetFilters($items);
			
			return response()->json(
				[
					'status' => StatusCode::OK,
					'response' => ['filters' => $filters, 'items' => $items]
				]
			);
		} else {
			return response()->json(
				[
					'status' => StatusCode::EMPTY,
					'message' => 'No items found.'
				]
			);
		}
	}
	
	/**
	 * Returns array of authenticated users inventory items.
	 * Optional appid can be specified, otherwise defaults to VGO appid (1).
	 * @param Request $request
	 * @return \Illuminate\Http\JsonResponse
	 */
	public function GetUserItems(Request $request)
	{
		$items = Trade::getUserItems(Auth::id(), $request->input('appid'));
		
		if(!empty($items)) {
			$filters = $this->GetFilters($items);
			
			return response()->json(
				[
					'status' => StatusCode::OK,
					'response' => ['filters' => $filters, 'items' => $items]
				]
			);
		} else {
			return response()->json(
				[
					'status' => StatusCode::EMPTY,
					'message' => 'No items found.'
				]
			);
		}
	}
	
	/**
	 * Returns array of sites available inventory items.
	 * Optional appid can be specified, otherwise defaults to VGO appid (1).
	 * @param Request $request
	 * @return \Illuminate\Http\JsonResponse
	 */
	public function GetSiteItems(Request $request)
	{
        $items = Trade::getSiteItems($request->input('appid'));

        if(!empty($items)) {
	        $filters = $this->GetFilters($items);

            return response()->json(
                [
                    'status' => StatusCode::OK,
                    'response' => ['filters' => $filters, 'items' => $items]
                ]
            );
        } else {
            return response()->json(
                [
                    'status' => StatusCode::EMPTY,
                    'message' => 'No items found.'
                ]
            );
        }
	}
	
	/**
	 * Submits request to deposit items.
	 * Returns offerid if successful.
	 * Expects a CSV list of item IDs items.
	 * @param Request $request
	 * @return \Illuminate\Http\JsonResponse
	 * @throws \Illuminate\Validation\ValidationException
	 */
	public function ItemDeposit(Request $request)
	{
		$this->validate($request, [
			'items' => 'required',
		]);
		
		$user = Auth::user();
		
		$items = $request->input('items');
		$items = str_getcsv($items);
		
		$tradetoken = null;
		if(preg_match("/\/t\/(\d{1,})\/([\w-]{8})/si", $user->tradelink, $tradelink)) {
			$tradetoken = $tradelink[2];
		}
		
		$req = false;
		if(!empty($user->tradelink) && !empty($tradetoken)) {
			$req = Trade::sendTradeOffer($user->id, $tradetoken, null, $items);
		}
		
		if($req !== false) {
			return response()->json(
				[
					'status' => StatusCode::OK,
					'response' => ['offerid' => $req]
				]
			);
		} else {
			return response()->json(
				[
					'status' => StatusCode::GENERIC_INTERNAL_ERROR,
					'message' => 'An error occured.'
				]
			);
		}
	}
	
	/**
	 * Submits request to withdraw items.
	 * Returns offerid if successful.
	 * Expects a CSV list of item IDs items.
	 * @param Request $request
	 * @return \Illuminate\Http\JsonResponse
	 * @throws \Illuminate\Validation\ValidationException
	 */
	public function ItemWithdraw(Request $request)
	{
		$this->validate($request, [
			'items' => 'required',
		]);
		
		$user = Auth::user();
		
		$items = $request->input('items');
		$items = str_getcsv($items);
		
		$tradetoken = null;
		if(preg_match("/\/t\/(\d{1,})\/([\w-]{8})/si", $user->tradelink, $tradelink)) {
			$tradetoken = $tradelink[2];
		}
		
		// get array of reserved item IDs
		$pending = DB::table('trade_withdraw_reserve')->select('id')->where('user_id', (int)$user->id)->pluck('id')->toArray();
		
		$req = false;
		// check trade link is set and make sure we are only withdrawing allowed items
		if(!empty($user->tradelink) && !empty($tradetoken) && count(array_intersect($items,$pending)) == count($items)) {
			$req = Trade::sendTradeOffer($user->id, $tradetoken, $items);
		}
		
		if($req !== false) {
			return response()->json(
				[
					'status' => StatusCode::OK,
					'response' => ['offerid' => $req]
				]
			);
		} else {
			return response()->json(
				[
					'status' => StatusCode::GENERIC_INTERNAL_ERROR,
					'message' => 'An error occured.'
				]
			);
		}
	}
}
