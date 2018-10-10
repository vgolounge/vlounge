import React from 'react';

export default class ItemBlock extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        	type: props.type || null,
            itemEnabled: true,
            buttonEnabled: true,
            buttonLoading: false,
	        offerStatus: (this.props.item.offer && this.props.item.offer.status === 1 && this.props.item.offer.time_expires > moment().format('X')),
	        offerID: (props.item.offer && this.props.item.offer.status === 1 && this.props.item.offer.time_expires > moment().format('X') ? props.item.offer.id : null)
        };

        this.withdrawSelected = this.withdrawSelected.bind(this);
        this.purchaseSelected = this.purchaseSelected.bind(this);
    }

    withdrawSelected(item) {
		let self = this;

		if(item.id > 0) {
			this.setState({
	            buttonEnabled: false,
			    buttonLoading: true
	        }, () => {
				$.ajax({
					"url": "/api/Trade/ItemWithdraw",
					"method": "POST",
					"data": {
						items: item.id
					},
					"success": function(res) {
						var obj = (res);
						if(obj.status === 1) {
							self.setState({
								buttonEnabled: true,
							    buttonLoading: false,
								offerStatus: true,
								offerID: obj.response.offerid
					        });
			            } else {
							console.log("Status:", obj.status, obj.message);
						}
			        }, "error": function(res) {
						var obj = (res);
						self.setState({
				            buttonEnabled: true,
						    buttonLoading: false
				        });
				        console.log("Status:", obj.status, obj.message);
			            console.log("Error");
			        }
				});
			});
		}
    }

    purchaseSelected(item) {
		let self = this;

		if(item.id > 0) {
			if(this.props.user.data) {
				this.setState({
		            buttonEnabled: false,
				    buttonLoading: true
		        }, () => {
					$.ajax({
						"url": "/api/Store/BuyItem",
						"method": "POST",
						"data": {
							item_id: item.id
						},
						"success": function(res) {
							var obj = (res);
							if(obj.status === 1) {
								self.setState({
					                type: 'w',
									itemEnabled: false,
						            buttonEnabled: true,
								    buttonLoading: false,
									offerStatus: true,
									offerID: obj.response.offer_id
						        });
								// TODO: update credits available with res.response.credits_remaining
				            } else {
								console.log("Status:", obj.status, obj.message);
							}
				        }, "error": function(res) {
							var obj = (res);
							self.setState({
						        buttonEnabled: true,
							    buttonLoading: false
					        });
							console.log("Status:", obj.status, obj.message);
				            console.log("Error");
				        }
					});
				});
			} else {
				window.location.href = "/login";
			}
		}
    }

    render() {
        return (
			<label className={'checkbox card is-inline-block vl-item-card' + (this.state.itemEnabled ? '' : ' is-disabled')} id={'item_' + this.props.item.id}>
	            <div className="card-image">
		            <figure className="image is-16by9">
			            <img src={this.props.item.preview_urls['thumb_image']} alt={this.props.item.name} />
		            </figure>
	            </div>
	            <div className="card-content is-paddingless">
		            <div className="has-text-weight-bold" style={{minHeight: '2rem'}}>{this.props.item.name}</div>
		            <div className="is-pulled-right">
			            { this.state.type === 'd' ?
				            <input type="checkbox" name="items[]" value={this.props.item.id} onChange={this.props.check} />
						: this.state.type === 'p' && this.props.user.data.credits < this.props.item.credits ?
						    <span className={'vl-button is-disabled'}>Purchase</span>
					    : this.state.type === 'p' ?
					        <span className={'vl-button' + (this.state.buttonEnabled ? '' : ' is-disabled')} onClick={() => this.purchaseSelected(this.props.item)}>{this.state.buttonLoading ? <div className='fa fa-spin fa-spinner'></div> : 'Purchase'}</span>
						: this.state.type === 'w' && this.state.offerStatus ?
					        <a className={'vl-button' + (this.state.buttonEnabled ? '' : ' is-disabled')} href={'https://trade.opskins.com/trade-offers/' + this.state.offerID} target="_blank">{this.state.buttonLoading ? <div className='fa fa-spin fa-spinner'></div> : 'View Offer'}</a>
						: this.state.type === 'w' && !this.state.offerStatus ?
					        <span className={'vl-button' + (this.state.buttonEnabled ? '' : ' is-disabled')} onClick={() => this.withdrawSelected(this.props.item)}>{this.state.buttonLoading ? <div className='fa fa-spin fa-spinner'></div> : 'Resend Offer'}</span>
						:
					        null
			            }
		            </div>
		            <div>{this.props.item.credits} credits</div>
	            </div>
            </label>
		);
    }
}