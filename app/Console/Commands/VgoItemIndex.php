<?php
namespace App\Console\Commands;

use App\Models\CategoryIndex;
use App\Models\Item;
use App\Models\RarityIndex;
use App\Models\TypeIndex;
use App\Models\WearIndex;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class VgoItemIndex extends Command
{
    protected $signature = 'store:vgoitemindex';
    protected $description = 'fetches the vgo item from opskins and populates item_index and related tables';

    public function handle(){
        $contents = @file_get_contents(config('app.opskins_apitrade_url') . "/IItem/GetItems/v1/?key=" . config('app.opskins_api_key'));
        if($obj = @json_decode($contents,true) AND $obj['status'] == 1)
        {
            $items = Item::get()->keyBy('name');
            foreach($obj['response']['items'] as $idx => $item){
                foreach($item as $idx2=>$item2){
                    $name = $item2['name'];
                    $category = $item2['category'];
                    $rarity = $item2['rarity'];
                    $type = $item2['type'];
                    $color = $item2['color'];
                    $image300 = $item2['image']['300px'];
                    $image600 = $item2['image']['600px'];
                    preg_match("/\((.*)\)/",$name,$matches);
                    if(count($matches) > 0)
                        $wear = $matches[1];
                    else
                        $wear = '';

                    $cat = CategoryIndex::where('name',$category)->first();
                    if($cat == null){
                        $cat = new CategoryIndex();
                        $cat->name = $category;
                        try {
                            $cat->saveOrFail();
                        }
                        catch(\Exception $e){
                            $this->line($e->getMessage());
                        }
                    }
                    $typer = TypeIndex::where('name',$type)->first();
                    if($typer == null) {
                        $typer = new TypeIndex();
                        $typer->name = $type;
                        try {
                            $typer->saveOrFail();
                        } catch (\Exception $e) {
                            $this->line($e->getMessage());
                        }
                    }
                    $rare = RarityIndex::where('name', $rarity)->first();
                    if ($rare == NULL && $rarity != "") {
                        $rare = new RarityIndex();
                        $rare->name = $rarity;
                        try {
                            $rare->saveOrFail();
                        } catch (\Exception $e) {
                            echo $e->getMessage();
                        }
                    }


                    $wearr = WearIndex::where('name',$wear)->first();
                    if($wearr== null && $wear != ""){
                        $wearr = new WearIndex();
                        $wearr->name = $wear;
                        try {
                            $wearr->saveOrFail();
                        }
                        catch(\Exception $e){
                            $this->line($e->getMessage());
                        }
                    }

                    $itemr = $items->get($name);
                    if($itemr == NULL) $itemr = new Item();
                    $itemr->fill([
                        'name' => $name,
                        'hashname' => $name,
                        'app_id' => 1912,
                        'category_id' => $cat?$cat->id:0,
                        'wear_id' => $wearr?$wearr->id:0,
                        'rarity_id' => $rare?$rare->id:0,
                        'type_id' => $typer?$typer->id:0,
                        'image_300' => $image300,
                        'image_600' => $image600,
                        'market_url' => '',
                        'color' => $color,
                    ]);
                    try {
                        $itemr->saveOrFail();
                    }
                    catch (\Exception $e){
                        $this->line($e->getMessage());
                    }
                    $this->line($name);
                }
            }
        }
        else {
            $this->line('Done');
        }
    }
}