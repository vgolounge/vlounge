import React from 'react';

import Loading from '../../extra/Loading';
import ItemBlock from '../../extra/ItemBlock';

export default class AccountPage_Pending extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            items: null,
	        offerId: null,
            isLoading: true,
            error: null
        };
    }

    componentDidMount() {
		if(this.state.isLoading) {
            fetch(`/api/Trade/GetUserPending`, {
                method: "GET"
            }).then(result => {
                return result.json();
            }).then(data => {
                if(data.status === 1) {
                    this.setState({
                        items: data.response.items,
                        isLoading: false
                    });
                } else if(data.status === 400) {
                    this.setState({
                        items: null,
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
    }

    render() {
        if(this.state.error) return <p>{this.state.error}</p>;

        let items = [];
        if(!this.state.isLoading && this.state.items) {
	        Object.keys(this.state.items).forEach((key, i) => {
	            let item = this.state.items[key];
	            items.push(<ItemBlock type={'w'} item={item} key={i} />);
	        });
        }

        return (
            <section className="section is-paddingless account-section" id="account-tab-4">
	            <h2 className="title is-size-4 vl-heading is-hidden-mobile">Pending</h2>
	            <div className="vl-container vl-container-body vl-deposit">
		            {this.state.isLoading ? <Loading color="black" /> : (!this.state.items ? <div className="is-fullwidth has-text-centered">You have no pending withdrawals</div> : null)}
		            <div style={{display: (this.state.isLoading && this.state.items ? 'none' : 'block')}}>
			            <div className="vl-item-container">
				            {items}
			            </div>
	                </div>
	            </div>
            </section>
        );
    }
}