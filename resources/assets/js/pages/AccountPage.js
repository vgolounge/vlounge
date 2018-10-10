/*
 this is the users accounts page.
 this will contain all the pages that the user can see in the
 */
import React from 'react';

import Loading from '../extra/Loading';
import {UserContext} from '../extra/UserContext'

import AccountPage_Bets         from './AccountPage/Bets';
import AccountPage_Deposit      from './AccountPage/Deposit';
import AccountPage_Overview     from './AccountPage/Overview';
import AccountPage_Pending      from './AccountPage/Pending';
import AccountPage_Transactions from './AccountPage/Transactions';

export default class AccountPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
	        menuOpen: false,
			activeTab: Number.parseInt(props.tab),
            isLoading: true,
            error: null
        };

        this.openMenu = this.openMenu.bind(this);
        this.closeMenu = this.closeMenu.bind(this);
        this.changeTab = this.changeTab.bind(this);
    }

    componentDidMount() {
    	if(this.props.user.status === 100) {
            this.setState({
                error: "Not authenticated.",
                isLoading: false
            });
        } else if(this.props.user.status !== 1) {
            this.setState({
                error: "error",
                isLoading: false
            });
        } else {
	        this.setState({
	            isLoading: false
	        });
	    }
    }

    openMenu(event) {
		event.preventDefault();

		this.setState({
            menuOpen: true
        });
    }

	closeMenu(event) {
		event.preventDefault();

		this.setState({
            menuOpen: false
        });
    }

    changeTab(event) {
		event.preventDefault();
    	let tab = event.currentTarget.dataset.id;

		this.setState({
            activeTab: Number.parseInt(tab === this.state.activeTab ? this.props.tab : tab),
			menuOpen: false
        }, () => {
			let pageSubUrl = '';
			switch(this.state.activeTab) {
			    case 2:
			        pageSubUrl = '/bets';
			        break;
			    case 3:
			        pageSubUrl = '/transactions';
			        break;
			    case 4:
			        pageSubUrl = '/deposit';
			        break;
			    case 5:
			        pageSubUrl = '/pending';
			        break;
			    default:
			        pageSubUrl = ''
			}
			//this.props.history.push('/account' + pageUrl);
			if(history.pushState) {
				window.history.pushState("", 'Account', '/account' + pageSubUrl);
			} else {
				document.location.href = '/account' + pageSubUrl;
			}
		});
    }

    render() {
    	if(this.state.isLoading) return (<Loading />);
        if(this.state.error) return <p>{this.state.error}</p>;

        return (
            <main id="account-page">
	            <div className="container is-widescreen is-fullhd">
		            <div className="container is-fluid vl-content">
			            <div className="columns is-marginless vl-account">
				            <AccountPage_Sidebar state={this.state} changeTab={this.changeTab} />
				            <div className="column is-paddingless">
					            <AccountPage_Dropdown state={this.state} openMenu={this.openMenu} closeMenu={this.closeMenu} changeTab={this.changeTab} />

					            {this.state.activeTab === 1 ? <AccountPage_Overview /> : null}
					            {this.state.activeTab === 2 ? <AccountPage_Bets /> : null}
					            {this.state.activeTab === 3 ? <AccountPage_Transactions /> : null}
					            {this.state.activeTab === 4 ? <AccountPage_Deposit /> : null}
					            {this.state.activeTab === 5 ? <AccountPage_Pending /> : null}
				            </div>
			            </div>
		            </div>
	            </div>
            </main>
        );
    }
}

export class AccountPage_Sidebar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
        	<UserContext.Consumer>
                {user =>
		            <div className="column is-paddingless is-hidden-mobile vl-sidebar">
			            <div className="container vl-container">
				            <div className="header">
					            <div className="vl-avatar is-clipped has-text-centered inline-block"><img className="avatar" src={user.data.avatar} alt="" /></div>
					            <div className="vl-username inline-block">Welcome {user.data.name}</div>
				            </div>
				            <ul>
					            <li className={'account-tab-select is-unselectable' + (this.props.state.activeTab===1 ? ' is-active' : '')} onClick={this.props.changeTab} data-id="1"><img src="/img/icon_overview.png" alt="Overview" title="Overview" />Overview</li>
					            <li className={'account-tab-select is-unselectable' + (this.props.state.activeTab===2 ? ' is-active' : '')} onClick={this.props.changeTab} data-id="2"><img src="/img/icon_bets.png" alt="Bets" title="Bets" />Bets</li>
					            <li className={'account-tab-select is-unselectable' + (this.props.state.activeTab===3 ? ' is-active' : '')} onClick={this.props.changeTab} data-id="3"><img src="/img/icon_transactions.png" alt="Transactions" title="Transactions" />Transactions</li>
					            <li className={'account-tab-select is-unselectable' + (this.props.state.activeTab===4 ? ' is-active' : '')} onClick={this.props.changeTab} data-id="4"><img src="/img/icon_deposit.png" alt="Deposit" title="Deposit" />Deposit</li>
					            <li className={'account-tab-select is-unselectable' + (this.props.state.activeTab===5 ? ' is-active' : '')} onClick={this.props.changeTab} data-id="5"><img src="/img/icon_pending.png" alt="Pending" title="Pending" />Pending</li>
				            </ul>
			            </div>
		            </div>
                }
	        </UserContext.Consumer>
        );
    }
}

export class AccountPage_Dropdown extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
    	return (
        	<div className="is-hidden-tablet has-text-centered">
	            <div className="vl-dropdown vl-dropdown-page has-text-left" tabIndex="0" onBlur={this.props.closeMenu}>
		            <div className="vl-dropdown-carat"><img src="/img/carat.png" alt="" title="" /></div>
		            <ul>
			            <li className={'account-tab-select is-unselectable' + (this.props.state.activeTab===1 ? ' is-active' : '')} onClick={this.props.state.menuOpen===true ? this.props.changeTab : this.props.openMenu} style={{display: (this.props.state.menuOpen===true || (this.props.state.menuOpen===false && this.props.state.activeTab===1) ? 'list-item' : 'none')}} data-id="1"><img src="/img/icon_overview.png" alt="Overview" title="Overview" />Overview</li>
			            <li className={'account-tab-select is-unselectable' + (this.props.state.activeTab===2 ? ' is-active' : '')} onClick={this.props.state.menuOpen===true ? this.props.changeTab : this.props.openMenu} style={{display: (this.props.state.menuOpen===true || (this.props.state.menuOpen===false && this.props.state.activeTab===2) ? 'list-item' : 'none')}} data-id="2"><img src="/img/icon_bets.png" alt="Bets" title="Bets" />Bets</li>
			            <li className={'account-tab-select is-unselectable' + (this.props.state.activeTab===3 ? ' is-active' : '')} onClick={this.props.state.menuOpen===true ? this.props.changeTab : this.props.openMenu} style={{display: (this.props.state.menuOpen===true || (this.props.state.menuOpen===false && this.props.state.activeTab===3) ? 'list-item' : 'none')}} data-id="3"><img src="/img/icon_transactions.png" alt="Transactions" title="Transactions" />Transactions</li>
			            <li className={'account-tab-select is-unselectable' + (this.props.state.activeTab===4 ? ' is-active' : '')} onClick={this.props.state.menuOpen===true ? this.props.changeTab : this.props.openMenu} style={{display: (this.props.state.menuOpen===true || (this.props.state.menuOpen===false && this.props.state.activeTab===4) ? 'list-item' : 'none')}} data-id="4"><img src="/img/icon_deposit.png" alt="Deposit" title="Deposit" />Deposit</li>
			            <li className={'account-tab-select is-unselectable' + (this.props.state.activeTab===5 ? ' is-active' : '')} onClick={this.props.state.menuOpen===true ? this.props.changeTab : this.props.openMenu} style={{display: (this.props.state.menuOpen===true || (this.props.state.menuOpen===false && this.props.state.activeTab===5) ? 'list-item' : 'none')}} data-id="5"><img src="/img/icon_pending.png" alt="Pending" title="Pending" />Pending</li>
		            </ul>
	            </div>
            </div>
        );
    }
}
