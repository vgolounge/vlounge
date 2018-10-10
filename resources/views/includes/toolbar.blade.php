<nav class="navbar is-primary" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
        <a href="/" class="navbar-item">vLounge</a>
    </div>
    <div class="navbar-menu">
        <div class="navbar-start">
            <a class="navbar-item" id="upcoming_menu">
                <div class="fa fa-clock"></div>
                Upcoming Matches
            </a>
            <a class="navbar-item" id="pastmatches_menu">
                <div class="fa fa-reply"></div>
                Past Matches
            </a>
            <a class="navbar-item" id="store_menu">
                <div class="fa fa-store"></div>
                Store
            </a>
        </div>
        <div class="navbar-end">
            @if(\App\Auth::check())
                <div class="navbar-item has-dropdown is-hoverable">
                    <a class="navbar-link">
                                    <span>
                                        {{ \App\Auth::user()->name }}
                                        <small>
                                            <br>
                                            <strong id="toolbar-user-credits">{{ \App\Auth::user()->credits }}</strong> credits
                                        </small>
                                    </span>
                        <img src="{{ \App\Auth::user()->avatar }}" alt="{{ \App\Auth::user()->name }}"
                             style="margin-left: 0.75rem">
                    </a>

                    <div class="navbar-dropdown is-right">
                        <a class="navbar-item" id='account_menu'>
                            Account
                        </a>
                        <a href="{{ route('logout') }}" class="navbar-item">
                            Logout
                        </a>
                    </div>
                </div>
            @else
                <a href="{{ route('login') }}" class="navbar-item">
                    <div class="fa fa-key"></div>
                    Sign in through OPSkins
                </a>
            @endif
        </div>
    </div>
</nav>