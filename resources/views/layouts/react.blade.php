<!DOCTYPE html>
<html lang="{{ config('app.locale') }}">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>@yield('title') - vLounge</title>
    <meta name="description" content="">
    <link rel="icon" href="/favicon.ico">
    <link rel="stylesheet" href="/css/fontawesome-all.css" crossorigin="anonymous">
    <link href="//fonts.googleapis.com/css?family=Roboto:400,400i,500" rel="stylesheet">
    <link rel="stylesheet" href="/css/style.css">
    @yield('style')
</head>
<body>

<section class="section is-paddingless wrapper">
    <div id="toolbar" class="container is-fluid is-marginless">
        <div class="navbar is-hidden-desktop">
            <div class="navbar-logo has-text-centered"><img src="/img/logo.png" class="logo" alt="logo" title="vLounge"></div>
            <div class="columns is-mobile is-marginless is-fixed-top">
                <div class="column navbar-drop has-text-left">
                    <div class="vl-drop"><img src="/img/hamburger.png" class="hamburger" alt="menu" title="Menu"></div>
                </div>
                <div class="column navbar-user has-text-right">
                    @if(\App\Auth::check())
                    <div class="vl-username">{{ \App\Auth::user()->name }}</div>
                    <div class="vl-credits"><span class="vl-balance">{{ \App\Auth::user()->credits }}</span>c</div>
                    @else
                    <a class="vl-login" href="{{ route('login') }}">Sign in through<br>OPSkins</a>
                    @endif
                </div>
            </div>
            <div class="modal navbar-modal">
                <div class="modal-background"></div>
                <div class="modal-content">
                    <div class="vl-search vl-search-site">
                        <div class="columns is-mobile">
                            <div class="column has-text-left is-paddingless vl-search-input">
                                <input type="text" name="search">
                            </div>
                            <div class="column has-text-right is-paddingless vl-search-button">
                                <div class="fa fa-search"></div>
                            </div>
                        </div>
                    </div>
                    <ul class="modal-menu is-uppercase">
                        <li><a href="/">Matches</a></li>
                        <li><a href="/store">Store</a></li>
                        <li><a href="/about">About</a></li>
                        @if(\App\Auth::check())
                        <li><a href="/account/deposit">Deposit</a></li>
                        <li><a href="/account">Account</a></li>
                        <li><a href="{{ route('logout') }}">Logout</a></li>
                        @endif
                    </ul>
                </div>
                <button class="modal-close is-large" aria-label="close"></button>
            </div>
        </div>
        <div class="navbar is-hidden-touch is-transparent">
            <div class="navbar-brand is-marginless">
                <a class="navbar-item" href="/"><img src="/img/logo.png" class="logo" alt="logo" title="vLounge"></a>
            </div>
            <div class="navbar-menu is-marginless">
                <div class="navbar-start">
                    <a class="navbar-item" href="/">Matches</a>
                    <a class="navbar-item" href="/store">Store</a>
                    <a class="navbar-item" href="/about">About</a>
                </div>
                <div class="navbar-end">
                    @if(\App\Auth::check())
                    <div class="navbar-item credits has-text-white">
                        <img src="/img/wallet.png" class="wallet" alt="wallet" title="Balance">
                        <div class="vl-credits"><span class="vl-balance">{{ \App\Auth::user()->credits }}</span>c</div>
                    </div>
                    <div class="navbar-item is-hoverable has-dropdown user has-text-white pointer">
                        <div class="vl-avatar is-clipped has-text-centered"><img class="avatar" src="{{ \App\Auth::user()->avatar }}" alt="{{ \App\Auth::user()->name }}"></div>
                        <div class="vl-username">{{ \App\Auth::user()->name }}</div>
                        <div class="navbar-dropdown is-right">
                            <a class="navbar-item" href="/account/deposit">Deposit</a>
                            <a class="navbar-item" href="/account">Account</a>
                            <a class="navbar-item" href="{{ route('logout') }}">Logout</a>
                        </div>
                    </div>
                    @else
                    <div class="navbar-item login has-text-white"><a class="vl-login" href="{{ route('login') }}"><img src="/img/opskins_signin.png" alt="Sign in with OPSkins" title="Sign in with OPSkins"></a></div>
                    @endif
                </div>
            </div>
        </div>
    </div>

    <div id="app" class="container is-fluid is-marginless">
        @yield('content')
        <!--div class="hero is-medium is-hidden-mobile has-background-white has-text-black">
            <div class="hero-head"></div>
            <div class="hero-body"></div>
            <div class="hero-foot"></div>
        </div-->
        <div class="container is-widescreen is-fullhd">
            <div class="container is-fluid vl-content">

            </div>
        </div>
    </div>

    <div id="footer" class="container is-fluid is-marginless">
        <div class="footer">
            footer
        </div>
    </div>

    <div id="modal-root"></div>
</section>

<script src="/js/jquery-3.3.1.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.2/moment.js"></script>
<script src="/js/app.min.js"></script>

@yield('script')

</body>
</html>
