<p class="menu-label">
    General
</p>
<ul class="menu-list">
    <li><a href="{{ route('admin') }}">Dashboard</a></li>
    <li><a href="{{ route('admin.inventory') }}">Inventory</a></li>
    <li><a href="{{ route('admin.users') }}">Users</a></li>
    <li><a href="{{ route('admin.settings') }}">Settings</a></li>
</ul>
<p class="menu-label">
    Betting
</p>
<ul class="menu-list">
    <li><a href="{{ route('admin.matches') }}">Matches list</a></li>
    <li><a href="{{ route('admin.bet-templates') }}">Bet templates</a></li>
</ul>
<p class="menu-label">
    Transactions
</p>
<ul class="menu-list">
    <li><a href="{{ route('admin.transactions', ['type' => 'deposit']) }}">Deposits</a></li>
    <li><a href="{{ route('admin.transactions', ['type' => 'withdraw']) }}">Withdraws</a></li>
</ul>