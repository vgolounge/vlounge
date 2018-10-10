<?php

use Illuminate\Database\Seeder;

class DefaultData extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        \App\Models\VideogamesIndex::insert([
            'name' => 'Counter-Strike',
            'desc' => 'Counter-Strike: Global Offensive',
            'slug' => 'csgo',
            'icon_url' => '//media.steampowered.com/apps/csgo/blog/images/CSGO_logo_ko.png',
        ]);
        \App\Models\BetTemplate::insert([
            // Who will win?
            [
                'videogame_id' => 1,
                'type' => 1,
                'permap' => 0,
                'minmaps' => 1,
                'opens_before' => '7d'
            ],
            // Who will win map X?
            [
                'videogame_id' => 1,
                'type' => 2,
                'permap' => 1,
                'minmaps' => 2,
                'opens_before' => '7d'
            ],
            // When will the bomb be planted for the first time on Map X?
            [
                'videogame_id' => 1,
                'type' => 3,
                'permap' => 1,
                'minmaps' => 2,
                'opens_before' => '7d'
            ],
            // When will the first AWP frag happen on Map X?
            [
                'videogame_id' => 1,
                'type' => 5,
                'permap' => 1,
                'minmaps' => 2,
                'opens_before' => '7d'
            ],
            // Total Maps played
            [
                'videogame_id' => 1,
                'type' => 4,
                'permap' => 0,
                'minmaps' => 3,
                'opens_before' => '7d'
            ],
            // Who will be first to get a kill?
            [
                'videogame_id' => 1,
                'type' => 6,
                'permap' => 0,
                'minmaps' => 1,
                'opens_before' => '7d'
            ],
            // Who will be first to die?
            [
                'videogame_id' => 1,
                'type' => 7,
                'permap' => 0,
                'minmaps' => 1,
                'opens_before' => '7d'
            ]
        ]);
    }
}
