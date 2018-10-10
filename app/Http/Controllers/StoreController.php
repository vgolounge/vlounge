<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Auth;
use App\Trade;
use App\StatusCode;
use App\Models\Transaction;
use Illuminate\Http\Request;

class StoreController extends Controller
{
	public function BuyItem(Request $request)
	{
		$this->validate($request, [
			'item_id' => 'int|required',
		]);
		
		$user = Auth::user();
		
		$item_id = (int)$request->input('item_id');
		
		$tradetoken = null;
		if(preg_match("/\/t\/(\d{1,})\/([\w-]{8})/si", $user->tradelink, $tradelink)) {
			$tradetoken = $tradelink[2];
		}
		
		if(!empty($user->tradelink) && !empty($tradetoken) && (int)$item_id > 0) {
			$items = Trade::getSiteItems($request->input('appid'));
			
			// make sure the the item being purchased exists
			if(array_key_exists($item_id, $items)) {
				$item = $items[$item_id];
				
				// get our price for this item
				$price = (DB::table('item_index')->select('suggested_price')->where('name', '=', $item['name'])->value('suggested_price') * 100);
				if((int)$price == 0) {
					$price = $item['suggested_price'];
				}
				
				if((int)$user->credits >= (int)$price) {
					$user->credits -= (int)$price;
					$user->save();
					
					// now we add the item ID to a table as a way to "reserve" them and not show them to other users.
					DB::table('trade_withdraw_reserve')->insert(
						[
							'id' => (int)$item['id'],
							'user_id' => $user->id
						]
					);
					
					$req = Trade::sendTradeOffer($user->id, $tradetoken, array((int)$item['id']));
					
					if($req !== false) {
						// log store purchase
						DB::table('store_purchase')->insert(
							[
								'user_id' => (int)$user->id,
								'offer_id' => (int)$req,
								'item_id' => (int)$item['id'],
								'sku' => (int)$item['sku'],
								'wear' => $item['wear'],
								'pattern_index' => (int)$item['pattern_index'],
								'name' => $item['name'],
								'price_at_time' => (int)$price
							]
						);
						
						// log transaction
						$log = new Transaction;
						$log->user_id = $user->id;
						$log->type = Transaction::TYPE_STORE_BUY;
						$log->offer = (int)$req;
						$log->items = (int)$item['id'];
						$log->credits = 0 - (int)$price;
						$log->save();
						
						return response()->json(
							[
								'status' => StatusCode::OK,
								'response' => [
									'offer_id' => (int)$req,
									'item_id' => (int)$item['id'],
									'credits_remaining' => (int)$user->credits
								]
							]
						);
					} else {
						// if something failed, undo the credit deduction
						$user->credits += (int)$item['credits'];
						$user->save();
						
						// and remove the purchase log
						DB::table('store_purchase')->where('user_id', (int)$user->id)->where('offer_id', (int)$req)->where('item_id', (int)$item['id'])->delete();
						
						// and remove the reservation
						DB::table('trade_withdraw_reserve')->where('id', (int)$item['id'])->delete();
						
						return response()->json(
							[
								'status' => StatusCode::GENERIC_INTERNAL_ERROR,
								'message' => 'Error sending item.'
							]
						);
					}
				} else {
					return response()->json(
						[
							'status' => StatusCode::GENERIC_INTERNAL_ERROR,
							'message' => 'Not enough credits.'
						]
					);
				}
			} else {
				return response()->json(
					[
						'status' => StatusCode::GENERIC_INTERNAL_ERROR,
						'message' => 'Item ID not found in site available inventory.'
					]
				);
			}
		} else {
			return response()->json(
				[
					'status' => StatusCode::GENERIC_INTERNAL_ERROR,
					'message' => 'Invalid or no trade link set.'
				]
			);
		}
	}
}
