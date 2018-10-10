<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Support\Facades\Artisan;
use Laravel\Lumen\Console\Kernel as ConsoleKernel;
use App\Trade;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        Commands\VgoItemIndex::class,
        Commands\PriceUpdate::class,
        Commands\CreateDefinitions::class,
    ];

    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        $schedule->command('store:vgoitemindex')->daily()->name('vgoitemindex');
        $schedule->command('store:price-update')->everyFifteenMinutes()->name('price-update');
		
        $schedule->call(function () {
            Trade::checkOffers();
        })->everyMinute()->name('check_offers');
       
        $schedule->command('store:bet-definitions')->everyFiveMinutes()->name('bet-definitions');
    }
}
