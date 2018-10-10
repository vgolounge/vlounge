<?php

use Illuminate\Database\Seeder;

class ExampleMatches extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        \App\Models\Players::insert([
            [
                'name' => 'ShahZaM',
                'first_name' => 'Shahzeb',
                'last_name' => 'Khan',
                'hometown' => 'United States',
                'current_team' => 2,
                'current_videogame' => 1
            ], [
                'name' => 'dephh',
                'first_name' => 'Rory',
                'last_name' => 'Jackson',
                'hometown' => 'United Kingdom',
                'current_team' => 2,
                'current_videogame' => 1
            ], [
                'name' => 'stanislaw',
                'first_name' => 'Peter',
                'last_name' => 'Jarguz',
                'hometown' => 'Canada',
                'current_team' => 2,
                'current_videogame' => 1
            ], [
                'name' => 'yay',
                'first_name' => 'Jaccob',
                'last_name' => 'Whiteaker',
                'hometown' => 'United States',
                'current_team' => 2,
                'current_videogame' => 1
            ], [
                'name' => 'ANDROID',
                'first_name' => 'Bradley',
                'last_name' => 'Fodor',
                'hometown' => 'Canada',
                'current_team' => 2,
                'current_videogame' => 1
            ],


            [
                'name' => 'ANGE1',
                'first_name' => 'Krill',
                'last_name' => 'Karasiow',
                'hometown' => 'Ukraine',
                'current_team' => 1,
                'current_videogame' => 1
            ],
            [
                'name' => 'bondik',
                'first_name' => 'Vladyslav',
                'last_name' => 'Nechyporchuk',
                'hometown' => 'Ukraine',
                'current_team' => 1,
                'current_videogame' => 1
            ]
        ]);
        \App\Models\Players::insert([
            [
                'name' => 'woxic',
                'current_team' => 1,
                'current_videogame' => 1
            ],
            [
                'name' => 'DeadFox',
                'current_team' => 1,
                'current_videogame' => 1
            ],
            [
                'name' => 'ISSAA',
                'current_team' => 1,
                'current_videogame' => 1
            ],

            [
                'name' => 'to1nou',
                'current_team' => 3,
                'current_videogame' => 1
            ],
            [
                'name' => 'ALEX',
                'current_team' => 3,
                'current_videogame' => 1
            ],
            [
                'name' => 'AmaNEk',
                'current_team' => 3,
                'current_videogame' => 1
            ],
            [
                'name' => 'devoduvek',
                'current_team' => 3,
                'current_videogame' => 1
            ],
            [
                'name' => 'LOGAN',
                'current_team' => 3,
                'current_videogame' => 1
            ],

            [
                'name' => 'TaZ',
                'current_team' => 4,
                'current_videogame' => 1
            ],
            [
                'name' => 'MINISE',
                'current_team' => 4,
                'current_videogame' => 1
            ],
            [
                'name' => 'rallen',
                'current_team' => 4,
                'current_videogame' => 1
            ],
            [
                'name' => 'reatz',
                'current_team' => 4,
                'current_videogame' => 1
            ],
            [
                'name' => 'mouz',
                'current_team' => 4,
                'current_videogame' => 1
            ]
        ]);
        \App\Models\Teams::insert([
            [
                'id' => 1,
                'name' => 'HellRaisers',
                'videogame_id' => 1
            ],
            [
                'id' => 2,
                'name' => 'compLexity',
                'videogame_id' => 1
            ],
            [
                'id' => 3,
                'name' => 'LDLC',
                'videogame_id' => 1
            ],
            [
                'id' => 4,
                'name' => 'Kinguin',
                'videogame_id' => 1
            ]
        ]);

        \App\Models\Leagues::insert([
            'name' => 'FACEIT Major 2018',
        ]);
        \App\Models\Series::insert([
            'name' => 'FACEIT Major 2018',
            'begins_at' => '2018-07-07 10:00:00',
            'end_at' => '2018-07-11 10:00:00',
            'prize_pool' => 50000,
            'league_id' => 1,
            'year' => 2018,
            'winner_type' => 'team'
        ]);
        \App\Models\Tournaments::insert([
            'name' => 'Grand final',
            'league_id' => 1,
            'series_id' => 1,
            'country' => 'Europe'
        ]);
        \App\Models\Matches::insert([
            [
                'name' => 'HellRaisers vs. compLexity',
                'begins_at' => \Carbon\Carbon::now()->subDays(7),
                'number_of_games' => 3,
                'tournament_id' => 1,
                'series_id' => 1,
                'videogame_id' => 1,
                'status' => 'Match over'
            ],
            [
                'name' => 'LDLC vs. Kinguin',
                'begins_at' => \Carbon\Carbon::now()->subDays(5),
                'number_of_games' => 1,
                'tournament_id' => 1,
                'series_id' => 1,
                'videogame_id' => 1,
                'status' => 'Match over'
            ],
            [
                'name' => 'Kinguin vs. compLexity',
                'begins_at' => \Carbon\Carbon::now(),
                'number_of_games' => 3,
                'tournament_id' => 1,
                'series_id' => 1,
                'videogame_id' => 1,
                'status' => 'Live'
            ],
            [
                'name' => 'LDLC vs. HellRaisers',
                'begins_at' => \Carbon\Carbon::now(),
                'number_of_games' => 1,
                'tournament_id' => 1,
                'series_id' => 1,
                'videogame_id' => 1,
                'status' => 'Live'
            ],
            [
                'name' => 'compLexity vs. HellRaisers',
                'begins_at' => \Carbon\Carbon::now()->addDays(7),
                'number_of_games' => 3,
                'tournament_id' => 1,
                'series_id' => 1,
                'videogame_id' => 1,
                'status' => 'Upcoming'
            ],
            [
                'name' => 'Kinguin vs. LDLC',
                'begins_at' => \Carbon\Carbon::now()->addDays(5),
                'number_of_games' => 1,
                'tournament_id' => 1,
                'series_id' => 1,
                'videogame_id' => 1,
                'status' => 'Upcoming'
            ],
        ]);
        \App\Models\Games::insert([
            [
                'match_id' => 1,
                'finished' => 1,
                'winner_id' => 1,
                'winner_type' => 'team',
                'map_name' => 'Cache',
                'videogame_id' => 1,
            ],
            [
                'match_id' => 1,
                'finished' => 1,
                'winner_id' => 2,
                'winner_type' => 'team',
                'map_name' => 'Inferno',
                'videogame_id' => 1,
            ],
            [
                'match_id' => 1,
                'finished' => 1,
                'winner_id' => 1,
                'winner_type' => 'team',
                'map_name' => 'Train',
                'videogame_id' => 1,
            ],

            [
                'match_id' => 2,
                'finished' => 1,
                'winner_id' => 4,
                'winner_type' => 'team',
                'map_name' => 'Dust 2',
                'videogame_id' => 1,
            ],


            [
                'match_id' => 3,
                'finished' => 1,
                'winner_id' => 4,
                'winner_type' => 'team',
                'map_name' => 'Inferno',
                'videogame_id' => 1,
            ],
        ]);
        \App\Models\Games::insert([
            [
                'match_id' => 3,
                'winner_type' => 'team',
                'map_name' => 'Mirage',
                'videogame_id' => 1,
            ],

            [
                'match_id' => 4,
                'winner_type' => 'team',
                'map_name' => 'Cache',
                'videogame_id' => 1,
            ],

            [
                'match_id' => 5,
                'winner_type' => 'team',
                'map_name' => 'Inferno',
                'videogame_id' => 1,
            ],
            [
                'match_id' => 5,
                'winner_type' => 'team',
                'map_name' => 'Mirage',
                'videogame_id' => 1,
            ],

            [
                'match_id' => 6,
                'winner_type' => 'team',
                'map_name' => 'TBA',
                'videogame_id' => 1,
            ],
        ]);

        \App\Models\CsgoGame::insert([
            [
                'game_id' => 1,
                'match_id' => 1,
                'team_1_id' => 1,
                'team_2_id' => 2,
                'team_1_score' => 16,
                'team_2_score' => 11,
                'team_1_ct_score' => 10,
                'team_1_t_score' => 6,
                'team_2_ct_score' => 9,
                'team_2_t_score' => 2,
            ],
            [
                'game_id' => 2,
                'match_id' => 1,
                'team_1_id' => 1,
                'team_2_id' => 2,
                'team_1_score' => 7,
                'team_2_score' => 18,
                'team_1_ct_score' => 4,
                'team_1_t_score' => 3,
                'team_2_ct_score' => 6,
                'team_2_t_score' => 9,
            ],
            [
                'game_id' => 3,
                'match_id' => 1,
                'team_1_id' => 1,
                'team_2_id' => 2,
                'team_1_score' => 16,
                'team_2_score' => 14,
                'team_1_ct_score' => 6,
                'team_1_t_score' => 10,
                'team_2_ct_score' => 5,
                'team_2_t_score' => 9,
            ],

            [
                'game_id' => 4,
                'match_id' => 2,
                'team_1_id' => 3,
                'team_2_id' => 4,
                'team_1_score' => 7,
                'team_2_score' => 18,
                'team_1_ct_score' => 4,
                'team_1_t_score' => 3,
                'team_2_ct_score' => 6,
                'team_2_t_score' => 9,
            ],


            [
                'game_id' => 5,
                'match_id' => 3,
                'team_1_id' => 4,
                'team_2_id' => 2,
                'team_1_score' => 16,
                'team_2_score' => 14,
                'team_1_ct_score' => 6,
                'team_1_t_score' => 10,
                'team_2_ct_score' => 5,
                'team_2_t_score' => 9
            ]
        ]);
        \App\Models\CsgoGame::insert([
            [
                'game_id' => 6,
                'match_id' => 3,
                'team_1_id' => 4,
                'team_2_id' => 2,
            ],

            [
                'game_id' => 7,
                'match_id' => 4,
                'team_1_id' => 3,
                'team_2_id' => 1,
            ],


            [
                'game_id' => 8,
                'match_id' => 5,
                'team_1_id' => 2,
                'team_2_id' => 1,
            ],
            [
                'game_id' => 9,
                'match_id' => 5,
                'team_1_id' => 2,
                'team_2_id' => 1,
            ],

            [
                'game_id' => 10,
                'match_id' => 6,
                'team_1_id' => 4,
                'team_2_id' => 3,
            ]
        ]);


        \Illuminate\Support\Facades\Artisan::call('store:bet-definitions');
    }
}
