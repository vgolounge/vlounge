<?php

namespace App;

use App\Events\UserDepositItemsEvent;
use App\Events\UserWithdrawItemsEvent;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use lfkeitel\phptotp\Totp;
use lfkeitel\phptotp\Base32;
use App\Models\Item;
use App\Models\Transaction;

class Trade {
	public static $app_id = 1;
	
	/**
	 * call inventory and cycle through each and every page
	 * @param int $uid
	 * @param int $app_id
	 * @param string $search
	 * @param int $page
	 * @return array|bool
	 */
	private static function cycleInventory($uid, $app_id = null, $search = null, $page = 1) {
		if(empty($app_id)) $app_id = self::$app_id;
		
		$items = array();
		
		if((int)$uid <= 0 || (int)$app_id <= 0) {
			return false;
		}
		
		$curl = curl_init();
		curl_setopt_array($curl, array(
			CURLOPT_URL => config('app.opskins_apitrade_url') . "/ITrade/GetUserInventory/v1/?uid=" . (int)$uid . '&app_id=' . (int)$app_id . '&per_page=500&page=' . (int)$page . (!empty($search) ? '&search=' . $search : null),
			CURLOPT_RETURNTRANSFER => true,
			CURLOPT_FOLLOWLOCATION => true,
			CURLOPT_TIMEOUT => 30,
			CURLOPT_CUSTOMREQUEST => "GET",
			CURLOPT_HTTPHEADER => array(
				'authorization: Basic ' . base64_encode(config('app.opskins_api_key') . ':'),
			),
		));
		$curl_data = curl_exec($curl);
		#$curl_err = curl_error($curl);
		curl_close($curl);
		$curl_data = json_decode($curl_data, true);
		
		if ($curl_data['status'] == 1) {
			$items = array_merge($items,$curl_data['response']['items']);
			if($curl_data['current_page'] < $curl_data['total_pages']) {
				$items = array_merge($items,self::cycleInventory($uid, $app_id, $search, ($page + 1)));
			}
		}
		
		return $items;
	}
	
	/**
	 * return list of items in users inventory
	 * @param int $uid
	 * @param int $app_id
	 * @param string $search
	 * @return array
	 */
	public static function getUserItems($uid, $app_id = null, $search = null) {
		if(empty($app_id)) $app_id = self::$app_id;
		
		$inventory = self::cycleInventory((int)$uid, $app_id, $search);
		
		$items = array();
		foreach($inventory as $item) {
			$items[$item['id']] = $item;
			$credits = (int)(Item::where('name', $item['name'])->pluck('suggested_price')->first() * 100);
			if((int)$credits == 0) {
				$credits = $item['suggested_price_floor'];
			}
			$items[$item['id']]['credits'] = $credits;
		}
		
		return $items;
	}
	
	/**
	 * return list of items pending withdrawal
	 * @param $uid
	 * @param null $app_id
	 * @param null $search
	 * @return array
	 */
	public static function getUserPending($uid, $app_id = null, $search = null) {
		if(empty($app_id)) $app_id = self::$app_id;
		
		$inventory = self::cycleInventory(config('app.opskins_uid'), $app_id, $search);
		
		// get array of reserved item IDs
		$pending = DB::table('trade_withdraw_reserve')->select('id')->where('user_id', (int)$uid)->pluck('id')->toArray();
		
		$items = array();
		foreach($inventory as $item) {
			if(in_array($item['id'], $pending)) {
				$items[$item['id']] = $item;
				
				$credits = (int)(Item::where('name', $item['name'])->pluck('suggested_price')->first() * 100);
				if((int)$credits == 0) {
					$credits = $item['suggested_price_floor'];
				}
				$items[$item['id']]['credits'] = $credits;
				
				$offer = DB::table('trade_offer_log')->where('uid', (int)$uid)->where('items_withdraw', (int)$item['id'])->orderBy('id', 'desc')->first();
				$items[$item['id']]['offer'] = $offer;
			}
		}
		
		return $items;
	}
	
	/**
	 * return list of items in site inventory (excluding reserved)
	 * @param int $app_id
	 * @param string $search
	 * @return array
	 */
	public static function getSiteItems($app_id = null, $search = null) {
		if(empty($app_id)) $app_id = self::$app_id;
		
		$inventory = self::cycleInventory(config('app.opskins_uid'), $app_id, $search);
		
		// get array of reserved item IDs
		$reserved = DB::table('trade_withdraw_reserve')->select('id')->pluck('id')->toArray();
		
		$items = array();
		foreach($inventory as $item) {
			if(!in_array($item['id'], $reserved)) {
				$items[$item['id']] = $item;
				$credits = (int)(Item::where('name', $item['name'])->pluck('suggested_price')->first() * 100);
				if((int)$credits == 0) {
					$credits = $item['suggested_price_floor'];
				}
				$items[$item['id']]['credits'] = $credits;
			}
		}
		
		return $items;
	}
	
	/**
	 * send trade offer to user
	 * @param int $uid
	 * @param string $token
	 * @param array $items_withdraw
	 * @param array $items_deposit
	 * @param string $message
	 * @return int|bool
	 * @throws \Exception
	 */
	public static function sendTradeOffer($uid, $token, $items_withdraw = array(), $items_deposit = array(), $message = null) {
		if((int)$uid <= 0 || empty($token) || (empty($items_withdraw) && empty($items_deposit))) {
			Log::info("sendTradeOffer: empty vars");
			return false;
		}
		
		if(!is_array($items_withdraw)) $items_withdraw = array();
		if(!is_array($items_deposit)) $items_deposit = array();
		
		// ensure that there are no duplicate item IDs
		$items_withdraw = array_unique($items_withdraw);
		$items_deposit = array_unique($items_deposit);
		
		// check for duplicates between the two
		$dupes = array_intersect($items_withdraw, $items_deposit);
		if(count($dupes) > 0) {
			Log::info("sendTradeOffer: dupes");
			return false;
		}
		
		if(!empty($items_deposit)) {
			// We need to make sure that we don't send items when we are only requesting
			// So we pull the users inventory and make sure that each item ID we are requesting exists
			$inventory_items = array_column(self::getUserItems($uid, self::$app_id), 'id');
			// if the number of matches between the two arrays is less than the number of items we are requesting then something isn't right.
			if(count(array_intersect($items_deposit, $inventory_items)) != count($items_deposit)) {
				Log::info("sendTradeOffer: deposit unavailable");
				return false;
			}
		}
		
		if(!empty($items_withdraw)) {
			// Ensure we still have the items we are sending
			// So we pull our inventory and make sure that each item ID we are sending exists
			$inventory_items = array_column(self::getUserItems(config('app.opskins_uid'), self::$app_id), 'id');
			
			// get array of reserved item IDs and remove them from $inventory_items
			$reserved = DB::table('trade_withdraw_reserve')->select('id')->where('user_id', '!=', (int)$uid)->pluck('id')->toArray();
			
			$available = array_diff($inventory_items, $reserved);
			
			// if the number of matches between the two arrays is less than the number of items we are sending then something isn't right.
			if(count(array_intersect($items_withdraw, $available)) != count($items_withdraw)) {
				Log::info("sendTradeOffer: withdraw unavailable");
				return false;
			}
		}
		
		// form trade offer
		$items_withdraw_csv = implode(',', $items_withdraw);
		$items_deposit_csv = implode(',', $items_deposit);
		
		$curl = curl_init();
		curl_setopt_array($curl, array(
			CURLOPT_URL => config('app.opskins_apitrade_url') . "/ITrade/SendOffer/v1/",
			CURLOPT_RETURNTRANSFER => true,
			CURLOPT_FOLLOWLOCATION => true,
			CURLOPT_CUSTOMREQUEST => "POST",
			CURLOPT_POST => true,
			CURLOPT_POSTFIELDS => 'uid=' . (int)$uid . '&token=' . $token . ($items_withdraw_csv != '' ? '&items_to_send=' . $items_withdraw_csv : '') . ($items_deposit_csv != '' ? '&items_to_receive=' . $items_deposit_csv : '') . '&twofactor_code=' . (new Totp())->GenerateToken(Base32::decode(config('app.opskins_totp_secret'))) . (!empty($message) ? '&message=' . $message : null),
			CURLOPT_HTTPHEADER => array(
				'content-type: application/x-www-form-urlencoded',
				'authorization: Basic ' . base64_encode(config('app.opskins_api_key') . ':'),
			),
		));
		curl_setopt($curl, CURLOPT_VERBOSE, true);
		$curl_data = curl_exec($curl);
		#$curl_err = curl_error($curl);
		#print_r(curl_getinfo($curl));
		#print_r(json_encode(json_decode($curl_data), JSON_PRETTY_PRINT));
		curl_close($curl);
		$curl_data = json_decode($curl_data, true);
	 
		if($curl_data['status'] == 1) {
			$offer = $curl_data['response']['offer'];
			if((int)$offer['id'] > 0) {
				// log sent trade offer
				DB::table('trade_offer_log')->insert(
					[
						'id' => $offer['id'],
						'uid' => $uid,
						'items_deposit' => $items_deposit_csv,
						'items_withdraw' => $items_withdraw_csv,
						'time_created' => $offer['time_created'],
						'time_expires' => $offer['time_expires']
					]
				);
				
				return $offer['id'];
			}
		} else {
			// if offer fails and is a withdrawal, we need to remove reservations
			if(!empty($items_withdraw)) {
				$unreserve = DB::table('trade_withdraw_reserve');
				$i = 0;
				foreach($items_withdraw as $item) {
					if ($i == 0) {
						$unreserve->where('id', '=', $item);
					} else {
						$unreserve->orWhere('id', '=', $item);
					}
					$i++;
				}
				$unreserve->delete();
			}
		}
		
		Log::info("sendTradeOffer:\n");
		Log::info($curl_data);
		return false;
	}
	
	/**
	 * process accepted offer
	 * @param int $offer_id
	 * @return int
	 */
	private static function offerAccepted($offer_id) {
		$return = 0;
		
		if((int)$offer_id > 0 && DB::table('trade_offer_log')->select('status')->where('id', '=', $offer_id)->value('status') == 1) {
			// get data
			$curl = curl_init();
			curl_setopt_array($curl, array(
				CURLOPT_URL => config('app.opskins_apitrade_url') . "/ITrade/GetOffer/v1/?offer_id=" . (int)$offer_id,
				CURLOPT_RETURNTRANSFER => true,
				CURLOPT_FOLLOWLOCATION => true,
				CURLOPT_CUSTOMREQUEST => "GET",
				CURLOPT_HTTPHEADER => array(
					'authorization: Basic ' . base64_encode(config('app.opskins_api_key') . ':'),
				),
			));
			$curl_data = curl_exec($curl);
			#$curl_err = curl_error($curl);
			#print_r(curl_getinfo($curl));
			#print_r(json_encode(json_decode($curl_data), JSON_PRETTY_PRINT));
			curl_close($curl);
			$curl_data = json_decode($curl_data, true);
			
			if($curl_data['status'] == 1) {
				$offer = $curl_data['response']['offer'];
				if((int)$offer['id'] > 0) {
					
					// process deposits
					$items_log = array();
					$items_array = array();
					$credits = 0;
					
					if(!empty($curl_data['response']['offer']['recipient']['items'])) {
						// cycle through the items in the offer to get data and prices
						foreach($curl_data['response']['offer']['recipient']['items'] as $item) {
							// get our price for this item
							$price = (DB::table('item_index')->select('suggested_price')->where('name', '=', $item['name'])->value('suggested_price') * 100);
							if((int)$price == 0) {
								$price = $item['suggested_price'];
							}
							
							$credits += $price;
							
							$items_log[] = array(
								'user_id' => (int)$curl_data['response']['offer']['recipient']['uid'],
								'offer_id' => (int)$offer['id'],
								'item_id' => (int)$item['id'],
								'sku' => (int)$item['sku'],
								'wear' => $item['wear'],
								'pattern_index' => (int)$item['pattern_index'],
								'name' => $item['name'],
								'price_at_time' => $price
							);
							
							$items_array[] = (int)$item['id'];
						}
						
						if(!empty($items_log)) {
							// log deposited items
							DB::table('trade_deposit')->insert(
								$items_log
							);
							
							// update users credits
							DB::table('users')->where('id', '=', (int)$curl_data['response']['offer']['recipient']['uid'])->increment('credits', (int)$credits);
							
							// log transaction
							$log = new Transaction;
							$log->user_id = (int)$curl_data['response']['offer']['recipient']['uid'];
							$log->type = Transaction::TYPE_ITEM_DEPOSIT;
							$log->offer = (int)$offer['id'];
							$log->items = implode(',', $items_array);
							$log->credits = (int)$credits;
							$log->save();

                            event(new UserDepositItemsEvent($log));
						}
					}
					
					// process withdraws
					$items_log = array();
					$items_array = array();
					$credits = 0;
					
					if(!empty($curl_data['response']['offer']['sender']['items'])) {
						// cycle through the items in the offer to get data and prices
						foreach($curl_data['response']['offer']['sender']['items'] as $item) {
							// get our price for this item
							$price = (DB::table('item_index')->select('suggested_price')->where('name', '=', $item['name'])->value('suggested_price') * 100);
							if((int)$price == 0) {
								$price = $item['suggested_price'];
							}
							
							$credits += $price;
							
							$items_log[] = array(
								'user_id' => (int)$curl_data['response']['offer']['recipient']['uid'],
								'offer_id' => (int)$offer['id'],
								'item_id' => (int)$item['id'],
								'sku' => (int)$item['sku'],
								'wear' => $item['wear'],
								'pattern_index' => (int)$item['pattern_index'],
								'name' => $item['name'],
								'price_at_time' => $price
							);
							
							$items_array[] = (int)$item['id'];
						}
						
						if(!empty($items_log)) {
							// log withdrawn items
							DB::table('trade_withdraw')->insert(
								$items_log
							);
							
							// log transaction
							$log = new Transaction;
							$log->user_id = (int)$curl_data['response']['offer']['recipient']['uid'];
							$log->type = Transaction::TYPE_ITEM_WITHDRAW;
							$log->offer = (int)$offer['id'];
							$log->items = implode(',', $items_array);
							$log->save();

							event(new UserWithdrawItemsEvent($log));
						}
					}
					
					// update trade offer log
					DB::table('trade_offer_log')
						->where('id', $offer_id)
						->update(['status' => 2]);
					
					$return = 2;
				}
			}
		}
		return $return;
	}
	
	/**
	 * set non-active offer as status 0
	 * @param $offer_id
	 * @return bool
	 */
	private static function offerDeclined($offer_id) {
		if((int)$offer_id > 0 && DB::table('trade_offer_log')->select('status')->where('id', '=', $offer_id)->value('status') == 1) {
			DB::table('trade_offer_log')
				->where('id', $offer_id)
				->update(['status' => 0]);
			return true;
		}
		return false;
	}
	
	/**
	 * check offer states
	 * @return bool
	 */
	public static function checkOffers() {
		Log::info("Checking offers");
		
		$page = 1;
		
		// get list of active offers we want to check
		$offers = DB::table('trade_offer_log')->select('id')->where('status', '=', 1)->orderBy('id', 'asc')->get()->toArray();
		if(!empty($offers)) {
			$ids = array();
			foreach($offers as $id) {
				$ids[] = $id->id;
			}
			$ids = array_unique($ids);
			$ids = implode(',',$ids);
			
			do {
				Log::info(config('app.opskins_apitrade_url') . "/ITrade/GetOffers/v1/?type=sent" . (!empty($ids) ? '&ids=' . $ids : null) . "&page=" . $page . "&key=HIDDEN");
				
				$curl = curl_init();
				curl_setopt_array($curl, array(
					CURLOPT_URL => config('app.opskins_apitrade_url') . "/ITrade/GetOffers/v1/?type=sent" . (!empty($ids) ? '&ids=' . $ids : null) . "&page=" . $page . "&key=" . config('app.opskins_api_key'),
					CURLOPT_RETURNTRANSFER => true,
					CURLOPT_FOLLOWLOCATION => true,
					CURLOPT_CUSTOMREQUEST => "GET",
				));
				$curl_data = curl_exec($curl);
				#$curl_err = curl_error($curl);
				#print_r(curl_getinfo($curl));
				#print_r(json_encode(json_decode($curl_data), JSON_PRETTY_PRINT));
				curl_close($curl);
				$curl_data = json_decode($curl_data, true);
				
				if ($curl_data['status'] == 1) {
					// $curl_data['response']['total']
					foreach($curl_data['response']['offers'] as $offer) {
						if($offer['state'] != 2 && DB::table('trade_offer_log')->select('status')->where('id', '=', $offer['id'])->value('status') == 1) {
							if($offer['state'] == 3) {
								self::offerAccepted($offer['id']);
								
								// if this is a withdrawal we need to remove item reservations
								if(!empty($offer['sender']['items']) && empty($offer['recipient']['items'])) {
									$unreserve = DB::table('trade_withdraw_reserve');
									$i = 0;
									foreach($offer['sender']['items'] as $item) {
										if ($i == 0) {
											$unreserve->where('id', '=', $item['id']);
										} else {
											$unreserve->orWhere('id', '=', $item['id']);
										}
										$i++;
									}
									$unreserve->delete();
								}
							} else {
								self::offerDeclined($offer['id']);
							}
						}
					}
					$page = (int)$curl_data['current_page'] + 1;
				}
			} while ((int)$curl_data['current_page'] < (int)$curl_data['total_pages'] || (int)$curl_data['current_page'] == 0 || (int)$curl_data['total_pages'] == 0);
			return true;
		}
		return false;
	}
}
