<!DOCTYPE html>
<html lang="{{ config('app.locale') }}">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>@yield('title') - vLounge</title>
    <meta name="description" content="">
    <link rel="icon" href="/favicon.ico">
    <link rel="stylesheet" href="/css/style.css">
    <link rel="stylesheet" href="/css/bulma.css">
    <link rel="stylesheet" href="/css/matches.css">
    <link rel="stylesheet" href="/css/score_card.css">
    <link rel="stylesheet" href="/css/fontawesome-all.css" crossorigin="anonymous">
</head>
<body>
<section class="section">
    <div class="container">
        <div>
            @include('includes.toolbar')
        </div>
        <div id="app">
            @yield('content')
        </div>
        @include('includes.footer')
    </div>
</section>
</body>
<script src="/js/jquery-3.3.1.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.2/moment.js"></script>
<script src="/js/vgoapp.js"></script>
<script src="/js/match_page.js"></script>
<script src="/js/upcoming.js"></script>
<script src="/js/account.js"></script>
<script src="/js/store.js"></script>
<script src="/js/score_card.js"></script>
<script src="/js/default.js"></script>

<script>
    $(function(){
        var user = {!!
            App\Auth::check() ?
                json_encode(App\Auth::user()->only([
                    'id', 'name', 'avatar', 'credits', 'tradelink'
                ])) : 'null'
        !!};

        window.vgoapp = new VGOApp(user);
    });
</script>
<script src="/js/app.min.js"></script>
</html>

