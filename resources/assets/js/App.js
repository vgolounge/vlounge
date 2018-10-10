import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Link} from 'react-router-dom'

import {User, UserContext} from './extra/UserContext';
import Loading from "./extra/Loading";
import FrontPage from './pages/FrontPage';
import MatchPage from './pages/MatchPage';
import StorePage from './pages/StorePage';
import AccountPage from './pages/AccountPage';
import About from './pages/About';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true
        };
    }

    componentDidMount() {
        const self = this;

    	this.user = new User();
        this.user.refresh(function() {
            self.setState({
		        isLoading: false
	        });
	    });
    }

    render() {
        if(this.state.isLoading) return (<Loading />);

    	return (
            <UserContext.Provider value={this.user}>
				<Route exact path="/" component={FrontPage}/>
				<Route exact path="/about" component={About}/>
                <Route path="/match/:matchId" component={MatchPage}/>
	            <Route exact path="/store" component={StorePage}/>
                <Route exact
					path="/account"
					render={routeProps => <AccountPage user={this.user} tab="1" {...routeProps} />}
				/>
		        <Route exact
					path="/account/bets"
					render={routeProps => <AccountPage user={this.user} tab="2" {...routeProps} />}
				/>
		        <Route exact
					path="/account/transactions"
					render={routeProps => <AccountPage user={this.user} tab="3" {...routeProps} />}
				/>
		        <Route exact
					path="/account/deposit"
					render={routeProps => <AccountPage user={this.user} tab="4" {...routeProps} />}
				/>
		        <Route exact
					path="/account/pending"
					render={routeProps => <AccountPage user={this.user} tab="5" {...routeProps} />}
				/>
            </UserContext.Provider>
        )
    }
}


ReactDOM.render(
    <BrowserRouter>
        <App/>
    </BrowserRouter>,
    document.getElementById('app')
);

/*
	Most of this is temp and will be converted to React
 */
$(document).on('click', '.vl-drop', function () {
	$(".navbar-modal").addClass("is-active");
	$(".vl-search input").focus();
});

$(document).on('click', '.modal-close, .modal-background', function () {
	$(".modal").removeClass("is-active");
	$(".vl-search input").val("");
});

$(document).on('click', '.vl-search-site .fa-search', function () {
	let search = $(this).closest(".vl-search").find("input").val();
	console.log(search);
	$(".vl-search-site input").val("");
});

/*
$(document).on('click', '.account-tab-select:not(.is-active)', function () {
	let drop = $(this).closest(".vl-dropdown");
	let tab = $(this).data("tab");

	$(".account-tab-select").removeClass("is-active");
	$(".vl-dropdown-page .account-tab-select").show();
	$(".account-section").hide();
	$(".account-tab-select[data-tab=" + tab + "]").addClass("is-active");
	$(".vl-dropdown-page .account-tab-select:not(.is-active)").hide();
	$(".account-section#account-tab-" + tab).show();
	$(drop).find("ul li:not(.is-active)").hide();
	$(drop).removeClass("is-active");
});
*/

/*$(document).on('click', '.bets-tab-select:not(.is-active)', function () {
	let drop = $(this).closest(".vl-dropdown");
	let tab = $(this).data("tab");

	$(".bets-tab-select").removeClass("is-active");
	$(".bets-section").hide();
	$(this).addClass("is-active");
	$(".bets-section#bets-tab-" + tab).show();
	$(drop).find("ul li:not(.is-active)").hide();
	$(drop).removeClass("is-active");
});

$(document).on('click', '.transactions-tab-select:not(.is-active)', function () {
	let drop = $(this).closest(".vl-dropdown");
	let tab = $(this).data("tab");

	$(".transactions-tab-select").removeClass("is-active");
	$(".transactions-section").hide();
	$(this).addClass("is-active");
	$(".transactions-section#bets-tab-" + tab).show();
	$(drop).find("ul li:not(.is-active)").hide();
	$(drop).removeClass("is-active");
});

$(document).on('click', '.bets-perpage:not(.is-active)', function () {
	let drop = $(this).closest(".vl-dropdown");
	let perpage = $(this).data("perpage");

	$(".bets-perpage").removeClass("is-active");
	$(this).addClass("is-active");
	$(drop).find("ul li:not(.is-active)").hide();
	$(drop).removeClass("is-active");
});*/

/*$(document).on('click', 'html:not(.vl-dropdown ul li)', function () {
	$(".vl-dropdown ul li:not(.is-active)").hide();
	$(".vl-dropdown").removeClass("is-active");
});*/

/*$(document).on('click', '.vl-dropdown:not(.is-active) ul li.is-active, .vl-dropdown .vl-dropdown-carat', function (event) {
	let drop = $(this).closest(".vl-dropdown");
	$(drop).addClass("is-active");
	$(drop).find("ul li").show();
	event.stopPropagation();
});*/
