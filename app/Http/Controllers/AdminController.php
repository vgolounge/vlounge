<?php

namespace App\Http\Controllers;

use App\Betting;
use App\Models\Bet;
use App\Models\BetTemplate;
use App\Models\Matches;
use App\Models\Transaction;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Yajra\DataTables\Facades\DataTables;

class AdminController extends Controller
{

	public function index(Request $request)
	{
	    $total_users = User::count();
	    $total_bets = Bet::whereIn('status', [Bet::STATUS_ACTIVE, Bet::STATUS_PAID])->count();

        $today_new_users = User::where('created_at', '>=', Carbon::today())->count();
        $today_bets = Bet::whereIn('status', [Bet::STATUS_ACTIVE, Bet::STATUS_PAID])
            ->where('created_at', '>=', Carbon::today())->count();
        $today_transactions = Transaction::where('timestamp', '>=', Carbon::today())->count();

	    return view('admin.dashboard', [
	        'total_users' => $total_users,
	        'total_bets' => $total_bets,
	        'today_new_users' => $today_new_users,
	        'today_bets' => $today_bets,
	        'today_transactions' => $today_transactions
        ]);
	}

	public function inventory(){
        return view('admin.inventory', []);
    }

	public function settings(){
        return view('admin.settings', [
            'settings' => DB::table('settings')->get()
        ]);
    }
	public function settingsSave(Request $request){
        DB::table('settings')->where('key', $request->input('key'))->update([
            'value' => $request->input('value'),
            'type' => $request->input('type')
        ]);
        return 1;
    }

    public function users(Request $request){
        return view('admin.users', []);
    }
    public function usersFilter(Request $request){
        try {
            return Datatables::eloquent(User::query())->make(true);
        } catch (\Exception $e) {
            return $e;
        }
    }
    public function usersSave(Request $request){
	    User::where('id', $request->input('id'))->update([
	        'credits' => $request->input('credits'),
            'is_admin' => $request->input('is_admin')
        ]);
	    return 1;
    }


    public function betTemplates(){
        return view('admin.bet-templates', []);
    }
    public function betTemplatesFilter(Request $request){
        try {
            return Datatables::eloquent(BetTemplate::query())->make(true);
        } catch (\Exception $e) {
            return $e;
        }
    }
    public function betTemplatesSave(Request $request){
	    $id = $request->input('id');
	    if($id)
	    {
	        if($request->input('delete'))
                BetTemplate::where('id', $request->input('id'))->delete();
	        else
                BetTemplate::where('id', $request->input('id'))->update([
                    'type' => $request->input('type'),
                    'permap' => $request->input('permap') ?: 0,
                    'minmaps' => $request->input('minmaps'),
                    'opens_before' => $request->input('opens_before')
                ]);
        }
	    else
            BetTemplate::create([
                'type' => $request->input('type'),
                'permap' => $request->input('permap') ?: 0,
                'minmaps' => $request->input('minmaps'),
                'opens_before' => $request->input('opens_before')
            ]);

        if($request->ajax())
            return 1;

        return redirect(route('admin.bet-templates'));
    }

    public function matches(){
        return view('admin.matches', []);
    }
    public function matchesFilter(Request $request){
        try {
            return Datatables::eloquent(Matches::with(['series.league']))->make(true);
        } catch (\Exception $e) {
            return $e;
        }
    }
    public function matchesSave(Request $request){
        Matches::where('id', $request->input('id'))->update([
            'hide' => $request->input('hide') ?: 0,
        ]);

        return 1;
    }
    public function matchesReturnBets(Request $request){
        $match = Matches::with('bet_definitions')->where('id', $request->input('id'))->first();
        if($match)
            foreach ($match->bet_definitions as $bet_definition)
                Betting::payouts($match, $bet_definition->type, 0);

        return 1;
    }


    public function transactions($type){
        return view('admin.transactions', ['type' => $type]);
    }
    public function transactionsFilter(Request $request){

        $builder = Transaction::with('user');
	    if($request->input('type') == 'deposit')
            $builder->where('type', Transaction::TYPE_ITEM_DEPOSIT)->with('deposits');
        else
            $builder->where('type', Transaction::TYPE_ITEM_WITHDRAW)->with('withdraw');

        try {
            return Datatables::eloquent($builder)->make(true);
        } catch (\Exception $e) {
            return $e;
        }
    }
}
