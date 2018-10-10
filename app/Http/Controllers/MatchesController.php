<?php
namespace App\Http\Controllers;

use App\Auth;
use App\Models\Bet;
use App\Models\BetDefinition;
use App\Models\MatchData;
use App\Models\Matches;
use App\Models\MatchStream;
use App\StatusCode;
use Illuminate\Http\Request;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Facades\DB;

class MatchesController extends Controller
{
    /**
     * Get bet by ID
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     * @throws \Illuminate\Validation\ValidationException
     */
    private static $pagination_size = 10;

    public function GetScoreCard(Request $request){
        $matchid = $request->input('mid');
        $ts = $request->input('ts');
        $match = Matches::where('id',$matchid)->first();
        if($match == NULL)
            return response()->json([]);
        else {
            if($ts == ""){
                $ts = microtime();
            }
            $mds = MatchData::where('timestamp','>=',$ts)->where('matchid',$matchid)->orderBy('timestamp','ASC')->get();
            $arr = [];
            $lastts = 0;
            for($i=0; $i < count($mds); $i++){

                $obj = ['ts'=>$mds[$i]->timestamp,"type"=>$mds[$i]->data_header,'data'=>json_decode($mds[$i]->data,true)];
                $arr['data'][] = $obj;
                $lastts = $mds[$i]->timestamp+1;
            }
            $arr['ts'] = $lastts;
            return response()->json($arr);
        }
    }

    public function GetUpcomingMatches(Request $request)
    {
        $search = $request->input('search');
        $page = $request->input('page') ?: 0;

        $matches_builder = Matches::where('begins_at', '>=', date('Y-m-d H:i:s'))->where('hide', 0)->orderBy('begins_at', 'ASC');
        if($search) $matches_builder->where('name', 'like', "%$search%");
        $matches = $matches_builder->get();

        $live_matches_builder = Matches::where('begins_at', '<=', date('Y-m-d H:i:s'))->where('hide', 0)->where('status','LIVE')->orderBy('begins_at', 'ASC');
        if($search) $live_matches_builder->where('name', 'like', "%$search%");
        $live_matches = $live_matches_builder->get();

        $outarr = $this->matchArray($matches);
        $outarr2 = $this->matchArray($live_matches);
        $dates =[];
        for($i=0; $i < count($outarr); $i++){
            if($outarr[$i]['begins_at'] != "") {
                $dt = new \DateTime($outarr[$i]['begins_at']);
                $dates[$dt->format("Y M")] = 1;
            }
        }

        $dates2 = array_keys($dates);

        return response()->json([
            'status' => StatusCode::OK,
            'response' => [
                'matches' => $outarr,
                'live_matches'=>$outarr2,
                'dates' => $dates2
            ]
        ]);
    }
    public function matchArray($matches){
        if(method_exists($matches, 'getCollection'))
            $matches = $matches->getCollection();
        if(method_exists($matches, 'load'))
            $matches->load([
                'tournament', 'series', 'series.league', 'csgo_games',
                'games', 'games.csgo_game', 'games.csgo_game.team1', 'games.csgo_game.team2',
                'main_bet_definition', 'main_bet_definition.options', 'main_bet_definition.bets'
            ]);

        $outarr = [];
        foreach ($matches as $match_row)
        {
            $match = $match_row->only([
                'id', 'name', 'number_of_games', 'draw', 'status', 'match_type'
            ]);
            $match['begins_at'] = $match_row->begins_at->format('Y-m-d H:i:s');

            $match['tournament'] = $match_row->tournament->only([
                'id', 'name', 'country', 'slug'
            ]);
            $match['series'] = $match_row->series->only([
                'name', 'year'
            ]);
            $match['league'] = $match_row->series->league->only([
                'name', 'image_url'
            ]);

            $team = $match_row->winner();
            $match['winner'] = $team == NULL?0:$team->id;
            $match['score'] = $match_row->matchScores();
            $match['is_live'] = $match_row->isLive();


            if($match_row->main_bet_definition) {
                $match['match_bet'] = $match_row->main_bet_definition->toArray();
                $match['match_bet']['options'] = $match_row->main_bet_definition->options->keyBy('pick');
            }
            else
                $match['match_bet'] = [];

            $match['games'] = [];
            foreach($match_row->games as $game_row){
                $game = [];
                $csgogame = $game_row->csgo_game;
                if($csgogame != null && $csgogame->team1 && $csgogame->team2) {
                    $game['name'] = $game_row->name;
                    $game['map_name'] = $game_row->map_name;

                    $game['team1'] = [];
                    $game['team1']['id'] = $csgogame->team1->id;
                    $game['team1']['name'] = $csgogame->team1->name;
                    $game['team1']['desc'] = $csgogame->team1->desc;
                    $game['team1']['image'] = file_exists(base_path('public/csgo_teams/'.$csgogame->team1->id)) ? '/team_logo/'.$csgogame->team1->id : $csgogame->team1->image_url;
                    $game['team1']['score'] = $csgogame->team_1_score;
                    $game['team1']['ct_score'] = $csgogame->team_1_ct_score;
                    $game['team1']['t_score'] = $csgogame->team_1_t_score;
                    $game['team1']['winner'] = ($csgogame->winner_id() == $game['team1']['id'])?1:0;

                    $game['team2'] = [];
                    $game['team2']['id'] = $csgogame->team2->id;
                    $game['team2']['name'] = $csgogame->team2->name;
                    $game['team2']['desc'] = $csgogame->team2->desc;
                    $game['team2']['image'] = file_exists(base_path('public/csgo_teams/'.$csgogame->team2->id)) ? '/team_logo/'.$csgogame->team2->id : $csgogame->team2->image_url;
                    $game['team2']['score'] = $csgogame->team_2_score;
                    $game['team2']['ct_score'] = $csgogame->team_2_ct_score;
                    $game['team2']['t_score'] = $csgogame->team_2_t_score;
                    $game['team2']['winner'] = ($csgogame->winner_id() == $game['team2']['id'])?1:0;

                    $match['team1'] = $game['team1'];
                    $match['team2'] = $game['team2'];
                    $match['games'][] = $game;
                }
            }
            $outarr[]= $match;
        }
        return $outarr;
    }
    public function GetMatchDetails(Request $request){
        $id = $request->input('id');
        $match = Matches::where('hide', 0)->find($id);
        if($match == NULL){
            return response()->json([
                'status'=>StatusCode::NOT_FOUND,
                'response'=>null
            ]);
        }
        else {
            //get match array
            $matchdata = $this->matchArray([$match])[0];

            $h2hmatches = Matches::distinct()->select('matches.*')->join('csgo_game', 'matches.id', 'csgo_game.match_id')
                ->where('begins_at', '<', $matchdata['begins_at'])
                ->where(function ($query) use ($matchdata){
                    $query->where([
                            'csgo_game.team_1_id' => $matchdata['team1']['id'],
                            'csgo_game.team_2_id' => $matchdata['team2']['id']
                        ])
                        ->orWhere(function($query) use ($matchdata){
                            $query->where([
                                'csgo_game.team_1_id' => $matchdata['team2']['id'],
                                'csgo_game.team_2_id' => $matchdata['team1']['id']
                            ]);
                        });
                })->limit(5)->orderBy('matches.begins_at', 'DESC')->get();
            $team1pastmatch = Matches::distinct()->select('matches.*')->join('csgo_game', 'matches.id', 'csgo_game.match_id')
                ->where('begins_at', '<', $matchdata['begins_at'])
                ->where(function ($query) use ($matchdata){
                    $query->where('csgo_game.team_1_id', $matchdata['team1']['id'])
                        ->orWhere('csgo_game.team_2_id', $matchdata['team1']['id']);
                })->limit(5)->orderBy('matches.begins_at', 'DESC')->get();
            $team2pastmatch = Matches::distinct()->select('matches.*')->join('csgo_game', 'matches.id', 'csgo_game.match_id')
                ->where('begins_at', '<', $matchdata['begins_at'])
                ->where(function ($query) use ($matchdata){
                    $query->where('csgo_game.team_1_id', $matchdata['team2']['id'])
                        ->orWhere('csgo_game.team_2_id', $matchdata['team2']['id']);
                })->limit(5)->orderBy('matches.begins_at', 'DESC')->get();


            $h2h = $this->matchArray($h2hmatches);
            $t1past = $this->matchArray($team1pastmatch);
            $t2past = $this->matchArray($team2pastmatch);

            $matchdata['streams'] = $match->streams;
            $matchdata['h2h'] = $h2h;
            $matchdata['team1_past_matches'] = $t1past;
            $matchdata['team2_past_matches'] = $t2past;

            return response()->json([
                'status'=>StatusCode::OK,
                'response'=>$matchdata
            ]);
        }
    }
    public function GetLiveMatches(Request $request){
        $search = $request->input('search');
        $page = $request->input('page') ?: 0;

        $live_matches_builder = Matches::where('begins_at', '<=', date('Y-m-d H:i:s'))->where('hide', 0)->where('status','LIVE')->orderBy('begins_at', 'ASC');
        if($search) $live_matches_builder->where('name', 'like', "%$search%");
        $live_matches = $live_matches_builder->get();

        $outarr2 = $this->matchArray($live_matches);

        return response()->json([
            'status' => StatusCode::OK,
            'response' => [
                'matches' => $outarr2,
            ]
        ]);
    }
    public function GetPastMatches(Request $request){
//        DB::listen(function($sql) {
//            dump($sql);
//        });

        $search = $request->input('search');
        $page = $request->input('page') ?: 1;
        Paginator::currentPageResolver(function() use ($page) {
            return $page;
        });

        $matches_builder = Matches::where('begins_at', '<', date('Y-m-d H:i:s'))->where('status','!=','LIVE')->where('hide', 0)->orderBy('begins_at', 'DESC');
        if($search) $matches_builder->where('name', 'like', "%$search%");

        $totalcount = ceil($matches_builder->count()/self::$pagination_size);
        $matches = $matches_builder->simplePaginate(self::$pagination_size);

        $outarr = $this->matchArray($matches);
        $dates =[];
        for($i=0; $i < count($outarr); $i++){
            $dt = new \DateTime($outarr[$i]['begins_at']);
            $dates[$dt->format("Y M")] = 1;
        }

        $dates2 = array_keys($dates);

        return response()->json([
            'status' => StatusCode::OK,
            'response' => [
                'matches' => $outarr,
                'dates' => $dates2,
                'total_pages' => $totalcount
            ]
        ]);
    }


    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     * @throws \Illuminate\Validation\ValidationException
     */
    public function GetBettingData(Request $request){
        $this->validate($request, [
            'match_id' => 'required|int',
        ]);

        $definitions = BetDefinition::where('match_id', $request->input('match_id'))->with(['bets', 'options'])->orderBy('order', 'asc')->get()->toArray();

        $defs = [];
        foreach($definitions as $def) {
        	$opts = [];
        	foreach($def['options'] as $opt) {
        		$opts[$opt['pick']] = $opt;
	        }
	        $def['options'] = $opts;
        	$defs[] = $def;
        }

        return response()->json([
            'status' => StatusCode::OK,
            'response' => [
                'definitions' => $defs
            ]
        ]);
    }
}