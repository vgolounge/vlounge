import React from 'react';

import {betTimerTick} from '../../helper'
import Loading from '../../extra/Loading';
import local from "../../localization";
import {Link} from "react-router-dom";

export default class AccountPage_Bets extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: null,
			activeTab: Number.parseInt(props.tab) || 1,
	        perPageOpen: false,
			activePerPage: 10,
	        activeSearch: null,
            isLoading: true,
            error: null
        };

        this.changeTab = this.changeTab.bind(this);
        this.openPerPage = this.openPerPage.bind(this);
        this.closePerPage = this.closePerPage.bind(this);
        this.changePerPage = this.changePerPage.bind(this);
        this.searchChange = this.searchChange.bind(this);
        this.searchDouble = this.searchDouble.bind(this);
    }

    componentDidMount() {
		this.setState({
            isLoading: false
        });
    }

    changeTab(event) {
		event.preventDefault();
    	let tab = event.currentTarget.dataset.id;

		this.setState({
            activeTab: Number.parseInt(tab === this.state.activeTab ? this.props.tab : tab)
        });
    }

    openPerPage(event) {
		event.preventDefault();

		this.setState({
            perPageOpen: true
        });
    }

    closePerPage(event) {
		event.preventDefault();

		this.setState({
            perPageOpen: false
        });
    }

    changePerPage(event) {
		event.preventDefault();
    	let perpage = event.currentTarget.dataset.id;

		this.setState({
            activePerPage: Number.parseInt(perpage === this.state.activeTab ? this.state.activeTab : perpage),
			perPageOpen: false
        }, () => {

		});
    }

    searchChange(event) {
    	let search = event.target.value;

        this.setState({
            activeSearch: search
        });
    }

    searchDouble(event) {
    	this.setState({
            activeSearch: null
        });
    }

    render() {
	    if(this.state.isLoading) return (<Loading />);
        if(this.state.error) return <p>{this.state.error}</p>;

        return (
            <section className="section is-paddingless account-section" id="account-tab-2">
	            <h2 className="title is-size-4 vl-heading is-hidden-mobile">Bets</h2>
	            <div className="vl-container vl-bets">
		            <div className="vl-container-header">
			            <div className="vl-options is-pulled-right">
				            <div className="vl-options-text">Items per page</div>
				            <div className="vl-dropdown vl-dropdown-bets has-text-left" tabIndex="0" onBlur={this.closePerPage}>
					            <div className="vl-dropdown-carat"><div className="fas fa-caret-down"></div></div>
					            <ul>
						            <li className={'bets-perpage is-unselectable' + (this.state.activePerPage===5 ? ' is-active' : '')} onClick={this.state.perPageOpen===true ? this.changePerPage : this.openPerPage} style={{display: (this.state.perPageOpen===true || (this.state.perPageOpen===false && this.state.activePerPage===5) ? 'list-item' : 'none')}} data-id="5">5</li>
						            <li className={'bets-perpage is-unselectable' + (this.state.activePerPage===10 ? ' is-active' : '')} onClick={this.state.perPageOpen===true ? this.changePerPage : this.openPerPage} style={{display: (this.state.perPageOpen===true || (this.state.perPageOpen===false && this.state.activePerPage===10) ? 'list-item' : 'none')}} data-id="10">10</li>
						            <li className={'bets-perpage is-unselectable' + (this.state.activePerPage===20 ? ' is-active' : '')} onClick={this.state.perPageOpen===true ? this.changePerPage : this.openPerPage} style={{display: (this.state.perPageOpen===true || (this.state.perPageOpen===false && this.state.activePerPage===20) ? 'list-item' : 'none')}} data-id="20">20</li>
						            <li className={'bets-perpage is-unselectable' + (this.state.activePerPage===50 ? ' is-active' : '')} onClick={this.state.perPageOpen===true ? this.changePerPage : this.openPerPage} style={{display: (this.state.perPageOpen===true || (this.state.perPageOpen===false && this.state.activePerPage===50) ? 'list-item' : 'none')}} data-id="50">50</li>
						            <li className={'bets-perpage is-unselectable' + (this.state.activePerPage===100 ? ' is-active' : '')} onClick={this.state.perPageOpen===true ? this.changePerPage : this.openPerPage} style={{display: (this.state.perPageOpen===true || (this.state.perPageOpen===false && this.state.activePerPage===100) ? 'list-item' : 'none')}} data-id="100">100</li>
					            </ul>
				            </div>
				            <div className="vl-search vl-search-bets">
					            <div className="columns is-mobile">
						            <div className="column has-text-left is-paddingless vl-search-input"><input type="text" name="search" value={this.state.activeSearch || ''} onChange={this.searchChange} onDoubleClick={this.searchDouble} /></div>
						            <div className="column has-text-right is-paddingless vl-search-button"><div className="fa fa-search"></div></div>
					            </div>
				            </div>
			            </div>
			            <div className="tabs is-small is-inline-block">
				            <ul>
					            <li className={'bets-tab-select is-unselectable' + (this.state.activeTab===1 ? ' is-active' : '')} onClick={this.changeTab} data-id="1"><a>LIVE</a></li>
					            <li className={'bets-tab-select is-unselectable' + (this.state.activeTab===2 ? ' is-active' : '')} onClick={this.changeTab} data-id="2"><a>UPCOMING</a></li>
					            <li className={'bets-tab-select is-unselectable' + (this.state.activeTab===3 ? ' is-active' : '')} onClick={this.changeTab} data-id="3"><a>PAST</a></li>
				            </ul>
			            </div>
		            </div>
		            {this.state.activeTab === 1 ? <AccountPage_Bets_Live activePerPage={this.state.activePerPage} activeSearch={this.state.activeSearch} /> : null}
		            {this.state.activeTab === 2 ? <AccountPage_Bets_Upcoming activePerPage={this.state.activePerPage} activeSearch={this.state.activeSearch} /> : null}
		            {this.state.activeTab === 3 ? <AccountPage_Bets_Past activePerPage={this.state.activePerPage} activeSearch={this.state.activeSearch} /> : null}
	            </div>
            </section>
        );
    }
}

export class AccountPage_Bets_Live extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        	activePerPage: props.activePerPage,
	        activeSearch: props.activeSearch,
	        page: 1,
	        total: 0,
	        pages: 0,
            data: null,
            isLoading: true,
            error: null
        };

        this.getBets = this.getBets.bind(this);
        this.pageChange = this.pageChange.bind(this);
        this.pageNext = this.pageNext.bind(this);
        this.pagePrev = this.pagePrev.bind(this);
    }

    componentDidMount() {
		if(this.state.isLoading) {
            this.getBets();
		}
    }

    componentWillReceiveProps(nextProps) {
    	if(this.props.activePerPage !== nextProps.activePerPage || this.props.activeSearch !== nextProps.activeSearch || this.props.page !== nextProps.page) {
			this.setState({
                activePerPage: nextProps.activePerPage || 5,
                activeSearch: nextProps.activeSearch || null,
                page: nextProps.page || 1
			}, () => {
                this.getBets();
            });
	    }
    }

    getBets() {
		fetch(`/api/User/GetBets?filter=1` + (this.state.activePerPage > 0 ? `&perpage=` + this.state.activePerPage : ``) + (this.state.activeSearch ? `&search=` + this.state.activeSearch : ``) + (this.state.page ? `&page=` + this.state.page : ``), {
            method: "GET"
        }).then(result => {
            return result.json();
        }).then(data => {
            if(data.status === 1) {
                this.setState({
                    total: data.response.total,
                    pages: data.response.pages,
                    data: data.response.bets,
                    isLoading: false
                });
            } else {
                this.setState({
                    error: "Error on fetch",
                    isLoading: false
                });
            }
        }).catch(error => {
            this.setState({
                error: "Error on fetch (catch)",
                isLoading: false
            });
        });
    }

    pageChange(event) {
		let newpage = parseInt(event.currentTarget.dataset.page);

		console.log(newpage);

		if(this.state.page !== newpage) {
			this.setState({
                page: newpage
            }, () => {
                this.getBets();
            });
		}
    }

    pageNext() {
		if(this.state.page < this.state.pages) {
			let newpage = this.state.page+1;
			this.setState({
                page: newpage
            }, () => {
                this.getBets();
            });
		}
    }

    pagePrev() {
		if(this.state.page > 1) {
			let newpage = this.state.page-1;
			this.setState({
                page: newpage
            }, () => {
                this.getBets();
            });
		}
    }

    render() {
    	if(this.state.error) return <p>{this.state.error}</p>;

        let data = [];
        if(!this.state.isLoading && Object.keys(this.state.data).length > 0) {
	        Object.keys(this.state.data).forEach((key, i) => {
	            let item = this.state.data[key];

				item.type_string = 'Team Win';
		        if(item.definition_data.type > 1) {
					item.type_string = 'Side Bet'
		        }

	            data.push(
	            	<tr key={i}>
			            <td className="is-hidden-touch is-uppercase">{item.type_string}</td>
			            <td className="is-hidden-touch"><Link to={'/match/' + item.match.id}>{item.match.name} ({item.definition_data ? item.definition_data.desc : 'Unknown'})</Link></td>
			            <td>{item.pick_data ? item.pick_data.desc  : 'Unknown'}</td>
			            <td>{item.amount}c</td>
			            <td>{item.odds}</td>
			            <td className="is-hidden-touch is-narrow is-paddingless is-size-0"><Link to={'/match/' + item.match.id}><img src="/img/stream_icon.png" alt="Watch" title="Watch" /></Link></td>
		            </tr>
	            );
	        });
        }

        let pages = [];
        if(!this.state.isLoading && data) {
        	if(this.state.pages <= 9) {
        		for(let i=1; i <= this.state.pages; i++) {
	                pages.push(
	                    <li key={i}><a className={'pagination-link' + (this.state.page === i ? ' is-current' : '')} aria-label={'Goto page ' + i} onClick={this.pageChange} data-page={i}>{i}</a></li>
		            );
		        }
	        } else {
				if(this.state.page <= 6 && (this.state.page < 4 || this.state.page > (this.state.pages - 4))) { // if we are near the start
        			for(let i=1; i <= 6; i++) {
		                pages.push(
		                    <li key={i}><a className={'pagination-link' + (this.state.page === i ? ' is-current' : '')} aria-label={'Goto page ' + i} onClick={this.pageChange} data-page={i}>{i}</a></li>
			            );
			        }
					pages.push(
	                    <li key="a"><span className="pagination-ellipsis">&hellip;</span></li>
		            );
					pages.push(
	                    <li key={this.state.pages}><a className={'pagination-link' + (this.state.page === this.state.pages ? ' is-current' : '')} aria-label={'Goto page ' + this.state.pages} onClick={this.pageChange} data-page={this.state.pages}>{this.state.pages}</a></li>
		            );
				} else if(this.state.page >= (this.state.pages - 6) && (this.state.page < 4 || this.state.page > (this.state.pages - 4))) { // if we are near the end
					pages.push(
	                    <li key="1"><a className={'pagination-link' + (this.state.page === 1 ? ' is-current' : '')} aria-label={'Goto page 1'} onClick={this.pageChange} data-page="1">1</a></li>
		            );
					pages.push(
						<li key="b"><span className="pagination-ellipsis">&hellip;</span></li>
		            );
					for(let i=(this.state.pages-6); i <= this.state.pages; i++) {
		                pages.push(
		                    <li key={i}><a className={'pagination-link' + (this.state.page === i ? ' is-current' : '')} aria-label={'Goto page ' + i} onClick={this.pageChange} data-page={i}>{i}</a></li>
			            );
			        }
				} else { // if we are in the middle
					pages.push(
	                    <li key="1"><a className={'pagination-link' + (this.state.page === 1 ? ' is-current' : '')} aria-label={'Goto page 1'} onClick={this.pageChange} data-page="1">1</a></li>
		            );
					pages.push(
	                    <li key="a"><span className="pagination-ellipsis">&hellip;</span></li>
		            );
					for(let i=(this.state.page-2); i <= (this.state.page+2); i++) {
		                pages.push(
		                    <li key={i}><a className={'pagination-link' + (this.state.page === i ? ' is-current' : '')} aria-label={'Goto page ' + i} onClick={this.pageChange} data-page={i}>{i}</a></li>
			            );
			        }
					pages.push(
	                    <li key="b"><span className="pagination-ellipsis">&hellip;</span></li>
		            );
					pages.push(
	                    <li key={this.state.pages}><a className={'pagination-link' + (this.state.page === this.state.pages ? ' is-current' : '')} aria-label={'Goto page ' + this.state.pages} onClick={this.pageChange} data-page={this.state.pages}>{this.state.pages}</a></li>
		            );
				}
	        }
        }

        return (
			<section className="bets-section vl-container-body">
				{!this.state.isLoading && data.length > 0 ?
					<div>
						<table className="table is-fullwidth">
				            <thead>
					            <tr>
						            <th>Type</th>
						            <th className="is-hidden-touch">Match</th>
						            <th>Pick</th>
						            <th>Credits</th>
						            <th>Odds</th>
						            <th className="is-hidden-touch is-narrow is-paddingless">Watch</th>
					            </tr>
				            </thead>
				            <tbody>
				                {data}
				            </tbody>
			            </table>
			            <div className="has-text-centered">
				            <nav className="pagination is-small is-centered" role="navigation" aria-label="pagination">
					            <a className="pagination-previous" disabled={this.state.page <= 1 ? 'disabled' : ''} onClick={this.pagePrev}>&lsaquo; Previous</a>
					            <ul className="pagination-list">
						            {pages}
					            </ul>
					            <a className="pagination-next" disabled={this.state.page >= this.state.pages ? 'disabled' : ''} onClick={this.pageNext}>Next &rsaquo;</a>
				            </nav>
			            </div>
					</div>
				:
					<div className="has-text-centered">You have no live bets</div>
				}
	        </section>
        )
    }
}

export class AccountPage_Bets_Upcoming extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        	activePerPage: props.activePerPage,
	        activeSearch: props.activeSearch,
	        page: 1,
	        total: 0,
	        pages: 0,
            data: null,
            isLoading: true,
            error: null
        };

        this.getBets = this.getBets.bind(this);
        this.pageChange = this.pageChange.bind(this);
        this.pageNext = this.pageNext.bind(this);
        this.pagePrev = this.pagePrev.bind(this);
    }

    componentDidMount() {
		if(this.state.isLoading) {
            this.getBets();
		}
    }

    componentWillReceiveProps(nextProps) {
    	if(this.props.activePerPage !== nextProps.activePerPage || this.props.activeSearch !== nextProps.activeSearch || this.props.page !== nextProps.page) {
			this.setState({
                activePerPage: nextProps.activePerPage || 5,
                activeSearch: nextProps.activeSearch || null,
                page: nextProps.page || 1
			}, () => {
                this.getBets();
            });
	    }
    }

    getBets() {
		fetch(`/api/User/GetBets?filter=2` + (this.state.activePerPage > 0 ? `&perpage=` + this.state.activePerPage : ``) + (this.state.activeSearch ? `&search=` + this.state.activeSearch : ``) + (this.state.page ? `&page=` + this.state.page : ``), {
            method: "GET"
        }).then(result => {
            return result.json();
        }).then(data => {
            if(data.status === 1) {
                this.setState({
                    total: data.response.total,
                    pages: data.response.pages,
                    data: data.response.bets,
                    isLoading: false
                });
            } else {
                this.setState({
                    error: "Error on fetch",
                    isLoading: false
                });
            }
        }).catch(error => {
            this.setState({
                error: "Error on fetch (catch)",
                isLoading: false
            });
        });
    }

    pageChange(event) {
		let newpage = parseInt(event.currentTarget.dataset.page);

		console.log(newpage);

		if(this.state.page !== newpage) {
			this.setState({
                page: newpage
            }, () => {
                this.getBets();
            });
		}
    }

    pageNext() {
		if(this.state.page < this.state.pages) {
			let newpage = this.state.page+1;
			this.setState({
                page: newpage
            }, () => {
                this.getBets();
            });
		}
    }

    pagePrev() {
		if(this.state.page > 1) {
			let newpage = this.state.page-1;
			this.setState({
                page: newpage
            }, () => {
                this.getBets();
            });
		}
    }

    render() {
    	if(this.state.error) return <p>{this.state.error}</p>;

        let data = [];
        if(!this.state.isLoading && Object.keys(this.state.data).length > 0) {
	        Object.keys(this.state.data).forEach((key, i) => {
	            let item = this.state.data[key];

				if(!item.definition_data) {
		        	item.type_string = 'Unknown';
		        } else if(item.definition_data && item.definition_data.type > 1) {
					item.type_string = 'Side Bet';
		        } else {
					item.type_string = 'Team Win';
				}

	            data.push(
	            	<tr key={i}>
			            <td><Countdown closes_at={item.definition_data ? item.definition_data.closes_at : null} /></td>
			            <td className="is-hidden-touch is-uppercase">{item.type_string}</td>
			            <td className="is-hidden-touch"><Link to={'/match/' + item.match.id}>{item.match.name} ({item.definition_data ? item.definition_data.desc : 'Unknown'})</Link></td>
			            <td><Link to={'/match/' + item.match.id}>{item.pick_data ? item.pick_data.desc : 'Unknown'}</Link></td>
			            <td>{item.amount}c</td>
			            <td>{item.odds}</td>
		            </tr>
	            );
	        });
        }

        let pages = [];
        if(!this.state.isLoading && data) {
        	if(this.state.pages <= 9) {
        		for(let i=1; i <= this.state.pages; i++) {
	                pages.push(
	                    <li key={i}><a className={'pagination-link' + (this.state.page === i ? ' is-current' : '')} aria-label={'Goto page ' + i} onClick={this.pageChange} data-page={i}>{i}</a></li>
		            );
		        }
	        } else {
				if(this.state.page <= 6 && (this.state.page < 4 || this.state.page > (this.state.pages - 4))) { // if we are near the start
        			for(let i=1; i <= 6; i++) {
		                pages.push(
		                    <li key={i}><a className={'pagination-link' + (this.state.page === i ? ' is-current' : '')} aria-label={'Goto page ' + i} onClick={this.pageChange} data-page={i}>{i}</a></li>
			            );
			        }
					pages.push(
	                    <li key="a"><span className="pagination-ellipsis">&hellip;</span></li>
		            );
					pages.push(
	                    <li key={this.state.pages}><a className={'pagination-link' + (this.state.page === this.state.pages ? ' is-current' : '')} aria-label={'Goto page ' + this.state.pages} onClick={this.pageChange} data-page={this.state.pages}>{this.state.pages}</a></li>
		            );
				} else if(this.state.page >= (this.state.pages - 6) && (this.state.page < 4 || this.state.page > (this.state.pages - 4))) { // if we are near the end
					pages.push(
	                    <li key="1"><a className={'pagination-link' + (this.state.page === 1 ? ' is-current' : '')} aria-label={'Goto page 1'} onClick={this.pageChange} data-page="1">1</a></li>
		            );
					pages.push(
						<li key="b"><span className="pagination-ellipsis">&hellip;</span></li>
		            );
					for(let i=(this.state.pages-6); i <= this.state.pages; i++) {
		                pages.push(
		                    <li key={i}><a className={'pagination-link' + (this.state.page === i ? ' is-current' : '')} aria-label={'Goto page ' + i} onClick={this.pageChange} data-page={i}>{i}</a></li>
			            );
			        }
				} else { // if we are in the middle
					pages.push(
	                    <li key="1"><a className={'pagination-link' + (this.state.page === 1 ? ' is-current' : '')} aria-label={'Goto page 1'} onClick={this.pageChange} data-page="1">1</a></li>
		            );
					pages.push(
	                    <li key="a"><span className="pagination-ellipsis">&hellip;</span></li>
		            );
					for(let i=(this.state.page-2); i <= (this.state.page+2); i++) {
		                pages.push(
		                    <li key={i}><a className={'pagination-link' + (this.state.page === i ? ' is-current' : '')} aria-label={'Goto page ' + i} onClick={this.pageChange} data-page={i}>{i}</a></li>
			            );
			        }
					pages.push(
	                    <li key="b"><span className="pagination-ellipsis">&hellip;</span></li>
		            );
					pages.push(
	                    <li key={this.state.pages}><a className={'pagination-link' + (this.state.page === this.state.pages ? ' is-current' : '')} aria-label={'Goto page ' + this.state.pages} onClick={this.pageChange} data-page={this.state.pages}>{this.state.pages}</a></li>
		            );
				}
	        }
        }

        return (
			<section className="bets-section vl-container-body">
	            {!this.state.isLoading && data.length > 0 ?
					<div>
						<table className="table is-fullwidth">
				            <thead>
					            <tr>
						            <th>Time Left</th>
						            <th className="is-hidden-touch">Type</th>
						            <th className="is-hidden-touch">Match</th>
						            <th>Pick</th>
						            <th>Credits</th>
						            <th>Odds</th>
					            </tr>
				            </thead>
				            <tbody>
				                {data}
				            </tbody>
			            </table>
			            <div className="has-text-centered">
				            <nav className="pagination is-small is-centered" role="navigation" aria-label="pagination">
					            <a className="pagination-previous" disabled={this.state.page <= 1 ? 'disabled' : ''} onClick={this.pagePrev}>&lsaquo; Previous</a>
					            <ul className="pagination-list">
						            {pages}
					            </ul>
					            <a className="pagination-next" disabled={this.state.page >= this.state.pages ? 'disabled' : ''} onClick={this.pageNext}>Next &rsaquo;</a>
				            </nav>
			            </div>
		            </div>
	            :
					<div className="has-text-centered">You have no upcoming bets</div>
				}
            </section>
        )
    }
}

export class AccountPage_Bets_Past extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        	activePerPage: props.activePerPage,
	        activeSearch: props.activeSearch,
	        page: 1,
	        total: 0,
	        pages: 0,
            data: null,
            isLoading: true,
            error: null
        };

        this.getBets = this.getBets.bind(this);
        this.pageChange = this.pageChange.bind(this);
        this.pageNext = this.pageNext.bind(this);
        this.pagePrev = this.pagePrev.bind(this);
    }

    componentDidMount() {
		if(this.state.isLoading) {
            this.getBets();
		}
    }

    componentWillReceiveProps(nextProps) {
    	if(this.props.activePerPage !== nextProps.activePerPage || this.props.activeSearch !== nextProps.activeSearch || this.props.page !== nextProps.page) {
			this.setState({
                activePerPage: nextProps.activePerPage || 5,
                activeSearch: nextProps.activeSearch || null,
                page: nextProps.page || 1
			}, () => {
                this.getBets();
            });
	    }
    }

    getBets() {
    	fetch(`/api/User/GetBets?filter=3` + (this.state.activePerPage > 0 ? `&perpage=` + this.state.activePerPage : ``) + (this.state.activeSearch ? `&search=` + this.state.activeSearch : ``) + (this.state.page ? `&page=` + this.state.page : ``), {
            method: "GET"
        }).then(result => {
            return result.json();
        }).then(data => {
            if(data.status === 1) {
                this.setState({
                    total: data.response.total,
                    pages: data.response.pages,
                    data: data.response.bets,
                    isLoading: false
                });
            } else {
                this.setState({
                    error: "Error on fetch",
                    isLoading: false
                });
            }
        }).catch(error => {
            this.setState({
                error: "Error on fetch (catch)",
                isLoading: false
            });
        });
    }

    pageChange(event) {
		let newpage = parseInt(event.currentTarget.dataset.page);

		console.log(newpage);

		if(this.state.page !== newpage) {
			this.setState({
                page: newpage
            }, () => {
                this.getBets();
            });
		}
    }

    pageNext() {
		if(this.state.page < this.state.pages) {
			let newpage = this.state.page+1;
			this.setState({
                page: newpage
            }, () => {
                this.getBets();
            });
		}
    }

    pagePrev() {
		if(this.state.page > 1) {
			let newpage = this.state.page-1;
			this.setState({
                page: newpage
            }, () => {
                this.getBets();
            });
		}
    }

    render() {
    	if(this.state.error) return <p>{this.state.error}</p>;

        let data = [];
        if(!this.state.isLoading && Object.keys(this.state.data).length > 0) {
	        Object.keys(this.state.data).forEach((key, i) => {
	            let item = this.state.data[key];

		        if(!item.definition_data) {
		        	item.type_string = 'Unknown';
		        } else if(item.definition_data && item.definition_data.type > 1) {
					item.type_string = 'Side Bet';
		        } else {
					item.type_string = 'Team Win';
				}

	            data.push(
	            	<tr key={i}>
			            <td>{item.definition_data ? moment(item.definition_data.closes_at).format("MM/DD/YY") : 'Unknown'}</td>
			            <td className="is-hidden-touch is-uppercase">{item.type_string}</td>
			            <td className="is-hidden-touch"><Link to={'/match/' + item.match.id}>{item.match.name} ({item.definition_data ? item.definition_data.desc : 'Unknown'})</Link></td>
			            <td><Link to={'/match/' + item.match.id}>{item.pick_data ? item.pick_data.desc : 'Unknown'}</Link></td>
			            <td>{item.amount}c</td>
			            <td className="is-hidden-touch">{item.odds}</td>
			            <td>{item.payout}c</td>
		            </tr>
	            );
	        });
        }

        let pages = [];
        if(!this.state.isLoading && data) {
        	if(this.state.pages <= 9) {
        		for(let i=1; i <= this.state.pages; i++) {
	                pages.push(
	                    <li key={i}><a className={'pagination-link' + (this.state.page === i ? ' is-current' : '')} aria-label={'Goto page ' + i} onClick={this.pageChange} data-page={i}>{i}</a></li>
		            );
		        }
	        } else {
				if(this.state.page <= 6 && (this.state.page < 4 || this.state.page > (this.state.pages - 4))) { // if we are near the start
        			for(let i=1; i <= 6; i++) {
		                pages.push(
		                    <li key={i}><a className={'pagination-link' + (this.state.page === i ? ' is-current' : '')} aria-label={'Goto page ' + i} onClick={this.pageChange} data-page={i}>{i}</a></li>
			            );
			        }
					pages.push(
	                    <li key="a"><span className="pagination-ellipsis">&hellip;</span></li>
		            );
					pages.push(
	                    <li key={this.state.pages}><a className={'pagination-link' + (this.state.page === this.state.pages ? ' is-current' : '')} aria-label={'Goto page ' + this.state.pages} onClick={this.pageChange} data-page={this.state.pages}>{this.state.pages}</a></li>
		            );
				} else if(this.state.page >= (this.state.pages - 6) && (this.state.page < 4 || this.state.page > (this.state.pages - 4))) { // if we are near the end
					pages.push(
	                    <li key="1"><a className={'pagination-link' + (this.state.page === 1 ? ' is-current' : '')} aria-label={'Goto page 1'} onClick={this.pageChange} data-page="1">1</a></li>
		            );
					pages.push(
						<li key="b"><span className="pagination-ellipsis">&hellip;</span></li>
		            );
					for(let i=(this.state.pages-6); i <= this.state.pages; i++) {
		                pages.push(
		                    <li key={i}><a className={'pagination-link' + (this.state.page === i ? ' is-current' : '')} aria-label={'Goto page ' + i} onClick={this.pageChange} data-page={i}>{i}</a></li>
			            );
			        }
				} else { // if we are in the middle
					pages.push(
	                    <li key="1"><a className={'pagination-link' + (this.state.page === 1 ? ' is-current' : '')} aria-label={'Goto page 1'} onClick={this.pageChange} data-page="1">1</a></li>
		            );
					pages.push(
	                    <li key="a"><span className="pagination-ellipsis">&hellip;</span></li>
		            );
					for(let i=(this.state.page-2); i <= (this.state.page+2); i++) {
		                pages.push(
		                    <li key={i}><a className={'pagination-link' + (this.state.page === i ? ' is-current' : '')} aria-label={'Goto page ' + i} onClick={this.pageChange} data-page={i}>{i}</a></li>
			            );
			        }
					pages.push(
	                    <li key="b"><span className="pagination-ellipsis">&hellip;</span></li>
		            );
					pages.push(
	                    <li key={this.state.pages}><a className={'pagination-link' + (this.state.page === this.state.pages ? ' is-current' : '')} aria-label={'Goto page ' + this.state.pages} onClick={this.pageChange} data-page={this.state.pages}>{this.state.pages}</a></li>
		            );
				}
	        }
        }

        return (
			<section className="bets-section vl-container-body">
	            {!this.state.isLoading && data.length > 0 ?
				    <div>
				        <table className="table is-fullwidth">
				            <thead>
					            <tr>
						            <th>Date</th>
						            <th className="is-hidden-touch">Type</th>
						            <th className="is-hidden-touch">Match</th>
						            <th>Pick</th>
						            <th>Credits</th>
						            <th className="is-hidden-touch">Odds</th>
						            <th>Payout</th>
					            </tr>
				            </thead>
				            <tbody>
				                {data}
				            </tbody>
			            </table>
			            <div className="has-text-centered">
				            <nav className="pagination is-small is-centered" role="navigation" aria-label="pagination">
					            <a className="pagination-previous" disabled={this.state.page <= 1 ? 'disabled' : ''} onClick={this.pagePrev}>&lsaquo; Previous</a>
					            <ul className="pagination-list">
						            {pages}
					            </ul>
					            <a className="pagination-next" disabled={this.state.page >= this.state.pages ? 'disabled' : ''} onClick={this.pageNext}>Next &rsaquo;</a>
				            </nav>
			            </div>
		            </div>
	            :
					<div className="has-text-centered">You have no past bets</div>
				}
            </section>
        )
    }
}

class Countdown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: <i className="fa fa-spin fa-spinner"></i>
        }
    }

    componentDidMount() {
        this.timerID = setInterval(() => this.tick(), 1000);
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        if(this.props.closes_at && this.state.status !== local.LOCKED) {
            this.setState({
                status: betTimerTick(this.props.closes_at, this.timerID)
            });
        }
    }

    render() {
        return this.state.status;
    }
}