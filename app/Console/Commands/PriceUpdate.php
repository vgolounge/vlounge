<?php
namespace App\Console\Commands;


use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class PriceUpdate extends Command {
    protected $signature = 'store:price-update';
    protected $description = 'Update prices from OPSkins';

	private static function remove_outliers($dataset, $magnitude = 1) {

		$count = count($dataset);
		$mean = array_sum($dataset) / $count; // Calculate the mean
		$deviation = sqrt(array_sum(array_map('self::sd_square', $dataset, array_fill(0, $count, $mean))) / $count) * $magnitude; // Calculate standard deviation and times by magnitude

		return array_filter($dataset, function($x) use ($mean, $deviation) { return ($x <= $mean + $deviation && $x >= $mean - $deviation); }); // Return filtered array of values that lie within $mean +- $deviation.
	}

	private static function sd_square($x, $mean) {
		return pow($x - $mean, 2);
	}

    public function handle() {
		// before we get the price list, get the lowest listed prices of all items and store in an array
		$curl = curl_init();
		curl_setopt_array($curl, array(
		    CURLOPT_URL => config('app.opskins_api_url') . "/IPricing/GetAllLowestListPrices/v1/?appid=1912",
		    CURLOPT_RETURNTRANSFER => true,
		    CURLOPT_FOLLOWLOCATION => true,
		    CURLOPT_CUSTOMREQUEST => "GET",
		    CURLOPT_HTTPHEADER => array(
		        'authorization: Basic ' . base64_encode(config('app.opskins_api_key') . ':'),
		    )
		));
		$lowest_data = curl_exec($curl);
		$lowest_err = curl_error($curl);
		#print_r(curl_getinfo($curl));
		curl_close($curl);
		$lowest_data = json_decode($lowest_data, true);

		// now we get the price list
		$curl = curl_init();
		curl_setopt_array($curl, array(
		    CURLOPT_URL => config('app.opskins_api_url') . "/IPricing/GetPriceList/v2/?appid=1912",
		    CURLOPT_RETURNTRANSFER => true,
		    CURLOPT_FOLLOWLOCATION => true,
		    CURLOPT_CUSTOMREQUEST => "GET"
		));
		$price_data = curl_exec($curl);
		$price_err = curl_error($curl);
		#print_r(curl_getinfo($curl));
		curl_close($curl);
		$price_data = json_decode($price_data, true);

		if ($price_data['status'] == 1) {
			if ($price_data['time'] < 1000) {
				$price_data['time'] = strtotime(date("Ymd"));
			}
			foreach ($price_data['response'] as $name => $data) {
				$skip = 0;

				if (empty($name)) {
					$skip = 1;
				}

				if ($skip == 0) {
					$data = array_slice($data, -7, 7, true);

					$means = array();
					$total = 0;
					foreach ($data as $day) {
						$total = $total + $day['normalized_mean'];
						$means[] = $day['normalized_mean'];
					}

					$means = self::remove_outliers($means, 1);

					$total = 0;
					foreach ($means as $mean) {
						$total += $mean;
					}

					$price = $total / count($means);

					// compare with lowest listed, if lower then use it
					if($lowest_data['status'] == 1 && array_key_exists($name, $lowest_data['response'])) {
						if (
							$lowest_data['response'][$name]['price'] > 0
							&& $lowest_data['response'][$name]['price'] < $price
						) {
							$price = $lowest_data['response'][$name]['price'];
						}
					}

					if ($price < 2) {
						$price = 2;
					}

					// uncomment this if we're storing as decimal
					$price = number_format($price / 100, 2, '.', '');

					DB::table('item_index')
			            ->where('name', $name)
			            ->update(['suggested_price' => $price]);
					
					echo $name . " - $" . $price . "\n";
				}
			}
		}
		else {
		    
        }
    }
}