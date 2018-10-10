import React from 'react';

import Loading from '../../extra/Loading';
import {UserContext} from "../../extra/UserContext";

export default class AccountPage_Overview extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            error: null
        };
    }

    componentDidMount() {
		this.setState({
            isLoading: false
        });
    }

    render() {
    	if(this.state.isLoading) return (<Loading />);
        if(this.state.error) return <p>{this.state.error}</p>;

        return (
            <section className="section is-paddingless account-section" id="account-tab-1">
	            <h2 className="title is-size-4 vl-heading is-hidden-mobile">Overview</h2>
	            <div className="vl-container vl-overview-stats">
		            <UserContext.Consumer>
	                    {user =>
				            <nav className="level">
					            <div className="level-item">
						            <div className="icon is-pulled-left"><img src="/img/icon_cash.png" alt="Today's Earnings" title="Today's Earnings" /></div>
						            <div className="text">
							            <p className="heading">Today's Earnings</p>
							            <p className="title">{user.data.stats.earnings_today || 0} Credits</p>
						            </div>
					            </div>
					            <div className="level-item">
						            <div className="icon is-pulled-left"><img src="/img/icon_chart.png" alt="Today's Betting Record" title="Today's Betting Record" /></div>
						            <div className="text">
							            <p className="heading">Today's Betting Record</p>
							            <p className="title">{user.data.stats.betrecord_today || '-'}</p>
						            </div>
					            </div>
					            <div className="level-item">
						            <div className="icon is-pulled-left"><img src="/img/icon_exclamation.png" alt="Today's Largest Bet" title="Today's Largest Bet" /></div>
						            <div className="text">
							            <p className="heading">Today's Largest Bet</p>
							            <p className="title">{user.data.stats.betlargest_today || 0} Credits</p>
						            </div>
					            </div>
				            </nav>
	                    }
		            </UserContext.Consumer>
	            </div>
	            <br />
	            <UserContext.Consumer>
	                {user =>
		                <TradeLink user={user} updateData={user.updateData} />
                    }
	            </UserContext.Consumer>
	            <br />
	            {/*<div className="vl-container vl-container-body vl-overview-pending">
		            <div className="title is-size-6 has-text-weight-bold">Pending Withdrawals</div>
		            <div className="vl-item-container">

		            </div>
	            </div>*/}
            </section>
        );
    }
}

export class TradeLink extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tradelink: props.user.data.tradelink,
            isLoading: true,
            error: null
        };

        this.tradelinkChange = this.tradelinkChange.bind(this);
        this.tradelinkSubmit = this.tradelinkSubmit.bind(this);
    }

    componentDidMount() {
		this.setState({
            isLoading: false
        });
    }

    tradelinkChange(event) {
    	let tradelink = event.target.value;

        this.setState({
            tradelink: tradelink
        });
    }

    tradelinkSubmit(event) {
		let self = this;
    	$.ajax({
			"url": "/api/User/UpdateTradeLink",
			"method": "POST",
			"data": {
				tradelink: self.state.tradelink
			},
			"success": function(res) {
				let obj = (res);
	            let tradelink = obj.response.tradelink;

				self.setState({
		            tradelink: tradelink
		        });
				self.props.updateData('tradelink', tradelink);
	            if(obj.status !== 1) {
		            console.log("Status:", obj.status, obj.message);
		        }
		    }, "error": function() {
		        console.log("Error");
		    }
		});
        event.preventDefault();
    }

    render() {
    	if(this.state.isLoading) return (<Loading color="black" />);
        if(this.state.error) return <p>{this.state.error}</p>;

        return (
			<div className="vl-container vl-container-body vl-overview-tradelink">
	            <form className="field" onSubmit={this.tradelinkSubmit}>
		            <div className="title is-size-6 has-text-weight-bold">Trade Link</div>
		            <div className="control">
			            <input id="tradelink" name="tradelink" className="input is-small" type="text" placeholder="Trade Link" value={this.state.tradelink || ''} onChange={this.tradelinkChange} />
				        <button id="tradelink_save" type="submit" className="button is-small is-primary">Save</button>
		            </div>
		            <p className="help">Can be found <a href="https://trade.opskins.com/settings" target="_blank">here</a>.</p>
	            </form>
            </div>
        )
    }
}
