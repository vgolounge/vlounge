import React from 'react';

import Loading from '../../extra/Loading';
import ItemBlock from '../../extra/ItemBlock';

export default class AccountPage_Deposit extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            items: null,
	        itemsSelected: [],
			depositEnabled: false,
	        depositSubmit: false,
	        offerId: null,
            isLoading: true,
            error: null
        };

        this.itemSelect = this.itemSelect.bind(this);
        this.depositSelected = this.depositSelected.bind(this);
    }

    componentDidMount() {
		if(this.state.isLoading) {
            fetch(`/api/Trade/GetUserItems`, {
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

    itemSelect(event) {
    	let selected = this.state.itemsSelected;
    	let index;

    	if(event.target.checked === true) {
			selected.push(+event.target.value);
		} else {
			index = selected.indexOf(+event.target.value);
		    selected.splice(index, 1);
		}

		this.setState({
	        itemsSelected: selected,
			depositEnabled: (selected.length > 0)
		});
    }

    depositSelected(event) {
		let self = this;
    	event.preventDefault();

		if(this.state.depositEnabled && this.state.itemsSelected.length > 0) {
			$.ajax({
				"url": "/api/Trade/ItemDeposit",
				"method": "POST",
				"data": {
					items: this.state.itemsSelected.join(",")
				},
				"success": function(res) {
					var obj = (res);
					if(obj.status === 1 && obj.response.offerid > 0) {
		                self.setState({
					        itemsSelected: [],
			                depositEnabled: false,
			                depositSubmit: true,
			                offerId: obj.response.offerid
					    });
		            } else {
						console.log("Status:", obj.status, obj.message);
					}
			    }, "error": function() {
			        console.log("Error");
			    }
			});
		}
    }

    render() {
        if(this.state.error) return <p>{this.state.error}</p>;

        let items = [];
        if(!this.state.isLoading && this.state.items) {
	        Object.keys(this.state.items).forEach((key, i) => {
	            let item = this.state.items[key];
	            items.push(<ItemBlock type={'d'} check={this.itemSelect} item={item} key={i} />);
	        });
        }

        return (
            <section className="section is-paddingless account-section" id="account-tab-4">
	            <h2 className="title is-size-4 vl-heading is-hidden-mobile">Deposit</h2>
	            <div className="vl-container vl-container-body vl-deposit">
		            {this.state.isLoading ? <Loading color="black" /> : (!this.state.items ? <div className="is-fullwidth has-text-centered">You have no items to deposit</div> : null)}
		            <div style={{display: (this.state.isLoading || this.state.depositSubmit || !this.state.items ? 'none' : 'block')}}>
		                <p>Select the items you wish to deposit and then click the Deposit Selected button</p>
		                <br />
			            <div className="control">
			                <button className="button is-primary" onClick={this.depositSelected} disabled={this.state.depositEnabled ? '' : 'disabled'}>Deposit Selected</button>
			            </div>
			            <br />
			            <div className="vl-item-container">
				            {items}
			            </div>
	                </div>
		            <div className="has-text-centered" style={{display: (!this.state.isLoading && this.state.depositSubmit && this.state.offerId > 0 ? 'block' : 'none')}}>
			            <div className="title is-size-6 has-text-weight-bold">Trade offer sent</div>
		                <a href={'https://trade.opskins.com/trade-offers/' + this.state.offerId}>click here to view and accept the offer</a>
		            </div>
	            </div>
            </section>
        );
    }
}