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
    <link rel="stylesheet" href="/css/fontawesome-all.css" crossorigin="anonymous">

    @yield('style')
</head>
<body id="admin-dashboard">

<section class="section">
    <div class="container">
        <div class="columns">
            <aside class="column is-one-fifth menu">
                @include('admin.navigation')
            </aside>
            <div class="column">
                @yield('content')
            </div>
        </div>
    </div>
</section>

<script src="/js/jquery-3.3.1.min.js"></script>
@yield('script')

</body>
</html>