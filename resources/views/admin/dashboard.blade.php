@extends('layouts.admin')

@section('title', 'Dashboard')

@section('content')
    <div class="columns">
        <div class="column">
            <div class="card">
                <header class="card-header">
                    <p class="card-header-title">
                        Total users
                    </p>
                </header>
                <div class="card-content has-text-centered">
                    <strong class="is-size-3">{{ $total_users }}</strong>
                </div>
            </div>
        </div>
        <div class="column">
            <div class="card">
                <header class="card-header">
                    <p class="card-header-title">
                        Total bets
                    </p>
                </header>
                <div class="card-content has-text-centered">
                    <strong class="is-size-3">{{ $total_bets }}</strong>
                </div>
            </div>
        </div>
        <div class="column">
            <div class="card">
                <header class="card-header">
                    <p class="card-header-title">
                        Total items
                    </p>
                </header>
                <div class="card-content has-text-centered">
                    <strong class="is-size-3" id="total-store-items">
                        <i class="fas fa-spinner fa-pulse"></i>
                    </strong>
                </div>
            </div>
        </div>
    </div>
    <div class="columns">
        <div class="column">
            <div class="card">
                <header class="card-header">
                    <p class="card-header-title">
                        Today new users
                    </p>
                </header>
                <div class="card-content has-text-centered">
                    <strong class="is-size-3">{{ $today_new_users }}</strong>
                </div>
            </div>
        </div>
        <div class="column">
            <div class="card">
                <header class="card-header">
                    <p class="card-header-title">
                        Today bets
                    </p>
                </header>
                <div class="card-content has-text-centered">
                    <strong class="is-size-3">{{ $today_bets }}</strong>
                </div>
            </div>
        </div>
        <div class="column">
            <div class="card">
                <header class="card-header">
                    <p class="card-header-title">
                        Today transactions
                    </p>
                </header>
                <div class="card-content has-text-centered">
                    <strong class="is-size-3" id="total-store-items">
                        {{ $today_transactions }}
                    </strong>
                </div>
            </div>
        </div>
    </div>
@endsection

@section('script')
    <script>
        const $total_store_items = $('#total-store-items')
        $.ajax({
            url: "/api/Trade/GetSiteItems",
            dataType: "json",
        })
        .fail(function() {
            $total_store_items.text('ERROR')
        })
        .done(function(res) {
            if (res.status === 1)
                $total_store_items.text(Object.keys(res.response.items).length)
            else
                $total_store_items.text('ERROR')
        })
    </script>
@endsection


