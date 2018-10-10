import React from 'react';

import Loading from '../../extra/Loading';
import {Link} from "react-router-dom";

export default class AccountPage_Transactions extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: null,
			activeFilter: Number.parseInt(props.filter) || 0,
	        perPageOpen: false,
			activePerPage: 10,
	        activeSearch: null,
            isLoading: true,
            error: null
        };

        this.changeFilter = this.changeFilter.bind(this);
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

    changeFilter(event) {
		event.preventDefault();
    	let filter = event.currentTarget.dataset.id;

		this.setState({
            activeFilter: Number.parseInt(filter === this.state.activeFilter ? this.props.filter : filter)
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
            <section className="section is-paddingless account-section" id="account-tab-3">
	            <h2 className="title is-size-4 vl-heading is-hidden-mobile">Transactions</h2>
	            <div className="vl-container vl-transactions">
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
				            {/*<div className="vl-search vl-search-transactions">
					            <div className="columns is-mobile">
						            <div className="column has-text-left is-paddingless vl-search-input"><input type="text" name="search" value={this.state.activeSearch || ''} onChange={this.searchChange} onDoubleClick={this.searchDouble} /></div>
						            <div className="column has-text-right is-paddingless vl-search-button"><div className="fa fa-search"></div></div>
					            </div>
				            </div>*/}
			            </div>
			            <div className="tabs is-small is-inline-block">
				            <ul>
					            <li className={'bets-tab-select is-unselectable' + (this.state.activeFilter===0 ? ' is-active' : '')} onClick={this.changeFilter} data-id="0"><a>All</a></li>
					            <li className={'bets-tab-select is-unselectable' + (this.state.activeFilter===1 ? ' is-active' : '')} onClick={this.changeFilter} data-id="1"><a>Deposits</a></li>
					            <li className={'bets-tab-select is-unselectable' + (this.state.activeFilter===2 ? ' is-active' : '')} onClick={this.changeFilter} data-id="2"><a>Withdrawals</a></li>
					            <li className={'bets-tab-select is-unselectable' + (this.state.activeFilter===3 ? ' is-active' : '')} onClick={this.changeFilter} data-id="3"><a>Purchases</a></li>
					            <li className={'bets-tab-select is-unselectable' + (this.state.activeFilter===4 ? ' is-active' : '')} onClick={this.changeFilter} data-id="4"><a>Bets</a></li>
				            </ul>
			            </div>
		            </div>
		            <AccountPage_Transactions_Data filter={this.state.activeFilter} activePerPage={this.state.activePerPage} activeSearch={this.state.activeSearch} />
	            </div>
	        </section>
        );
    }
}

export class AccountPage_Transactions_Data extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        	filter: props.filter || null,
        	activePerPage: props.activePerPage,
	        activeSearch: props.activeSearch,
	        page: 1,
	        total: 0,
	        pages: 0,
            data: null,
            isLoading: true,
            error: null
        };

        this.getTransactions = this.getTransactions.bind(this);
        this.pageChange = this.pageChange.bind(this);
        this.pageNext = this.pageNext.bind(this);
        this.pagePrev = this.pagePrev.bind(this);
    }

    componentDidMount() {
		if(this.state.isLoading) {
            this.getTransactions();
		}
    }

    componentWillReceiveProps(nextProps) {
    	if(this.props.filter !== nextProps.filter || this.props.activePerPage !== nextProps.activePerPage || this.props.activeSearch !== nextProps.activeSearch || this.props.page !== nextProps.page) {
            this.setState({
                filter: nextProps.filter,
                activePerPage: nextProps.activePerPage || 5,
                activeSearch: nextProps.activeSearch || null,
                page: nextProps.page || 1
			}, () => {
                this.getTransactions();
            });
	    }
    }

    getTransactions() {
    	fetch(`/api/User/GetTransactions` + (this.state.filter > 0 ? `?filter=` + this.state.filter : `?filter=0`) + (this.state.activePerPage > 0 ? `&perpage=` + this.state.activePerPage : ``) + (this.state.activeSearch ? `&search=` + this.state.activeSearch : ``) + (this.state.page ? `&page=` + this.state.page : ``), {
            method: "GET"
        }).then(result => {
            return result.json();
        }).then(data => {
            if(data.status === 1) {
                this.setState({
                    total: data.response.total,
                    pages: data.response.pages,
                    data: data.response.transactions,
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
                this.getTransactions();
            });
		}
    }

    pageNext() {
		if(this.state.page < this.state.pages) {
			let newpage = this.state.page+1;
			this.setState({
                page: newpage
            }, () => {
                this.getTransactions();
            });
		}
    }

    pagePrev() {
		if(this.state.page > 1) {
			let newpage = this.state.page-1;
			this.setState({
                page: newpage
            }, () => {
                this.getTransactions();
            });
		}
    }

    render() {
    	if(this.state.error) return <p>{this.state.error}</p>;

        let data = [];
        if(!this.state.isLoading && Object.keys(this.state.data).length > 0) {
	        Object.keys(this.state.data).forEach((key, i) => {
	            let item = this.state.data[key];

	            item.filter = 0;
		        if(item.type === 1) { // Deposit
					item.filter = 1;
		        } else if(item.type === 2) { // Item Withdraw
					item.filter = 2;
		        } else if(item.type === 3) { // Item Buy
					item.filter = 3;
		        } else if(item.type === 4) { // Item Sell
					item.filter = 3;
		        } else if(item.type === 5) { // Bet Place
					item.filter = 4;
					if(item.var2) {
						//item.desc = <Link to={'/match/' + item.var2}>{item.desc}</Link>
					}
		        } else if(item.type === 6) { // Bet Cancel
					item.filter = 4;
					if(item.var2) {
						//item.desc = <Link to={'/match/' + item.var2}>{item.desc}</Link>
					}
		        } else if(item.type === 7) { // Bet Payout
					item.filter = 4;
					if(item.var2) {
						//item.desc = <Link to={'/match/' + item.var2}>{item.desc}</Link>
					}
		        } else if(item.type === 8) { // Credit Comp
					item.filter = 5;
		        } else if(item.type === 9) { // Credit Refund
					item.filter = 5;
		        } else {
					item.filter = 5;
		        }

		        if(item.items.length > 0) {
		        	item.desc = [];
		        	item.items.forEach(function(entry) {
						item.desc.push(entry.name);
					});
					item.desc = item.desc.join(', ');
		        }

	            data.push(
	            	<tr key={i}>
			            <td>{moment(item.timestamp).format("MM/DD/YY h:mmA")}</td>
			            <td>{item.type_string}</td>
			            <td>{item.desc}</td>
			            <td>{item.type !== 2 ? item.credits + 'c' : null}</td>
			            {/*<td>{item.balance}c</td>*/}
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
			<div className="vl-container-body">
	            {!this.state.isLoading && data.length > 0 ?
					<div>
						<table className="table is-fullwidth">
				            <thead>
					            <tr>
						            <th>Date</th>
						            <th>Type</th>
						            <th>Description</th>
						            <th>Amount</th>
						            {/*<th>Balance</th>*/}
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
					<div className="has-text-centered">No transactions</div>
				}
            </div>
        )
    }
}
