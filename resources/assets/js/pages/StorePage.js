import React from 'react';
/*
 The store page displays, the store items.
 */
import Loading from '../extra/Loading';
import {UserContext} from '../extra/UserContext'
import ItemBlock from "../extra/ItemBlock";

export default class StorePage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            items: null,
	        offerId: null,
	        filters: null,
        	menuOpen: false,
            filter_search: null,
            filter_type: null,
		    filter_rarity: null,
		    filter_wear: null,
		    filter_price_min: null,
		    filter_price_max: null,
            isLoading: true,
            error: null
        };

        this.openMenu = this.openMenu.bind(this);
        this.closeMenu = this.closeMenu.bind(this);
        this.updateSearch = this.updateSearch.bind(this);
        this.setFilterType = this.setFilterType.bind(this);
        this.setFilterRarity = this.setFilterRarity.bind(this);
        this.setFilterWear = this.setFilterWear.bind(this);
        this.updatePriceMin = this.updatePriceMin.bind(this);
        this.updatePriceMax = this.updatePriceMax.bind(this);
    }

    componentDidMount() {
        if(this.state.isLoading) {
            fetch(`/api/Trade/GetSiteItems`, {
                method: "GET"
            }).then(result => {
                return result.json();
            }).then(data => {
                if(data.status === 1) {
                    this.setState({
                        filters: data.response.filters,
                        items: data.response.items,
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

    updateSearch(event) {
    	event.persist();
    	let value = event.target.value;

    	if(event.type === 'dblclick') {
    		this.setState({
	            filter_search: null
	        });
	    } else {
	        this.setState({
	            filter_search: value
	        });
	    }
    }

    setFilterType(event) {
    	let value = event.currentTarget.dataset.id;

		if(this.state.filter_type === value) {
			this.setState({
	            filter_type: null
	        });
		} else {
			this.setState({
	            filter_type: value
	        });
		}
    }

    setFilterRarity(event) {
    	let value = event.currentTarget.dataset.id;

		if(this.state.filter_rarity === value) {
			this.setState({
	            filter_rarity: null
	        });
		} else {
			this.setState({
	            filter_rarity: value
	        });
		}
    }

    setFilterWear(event) {
    	let value = parseInt(event.currentTarget.dataset.id);

		if(this.state.filter_wear === value) {
			this.setState({
	            filter_wear: null
	        });
		} else {
			this.setState({
	            filter_wear: value
	        });
		}
    }

    updatePriceMin(event) {
    	event.persist();
    	let value = event.target.value;

    	if(event.type === 'dblclick') {
    		this.setState({
	            filter_price_min: null
	        });
	    } else {
	        if(!isNaN(value) && (function(x) { return (x | 0) === x; })(parseFloat(value))) {
		        this.setState({
		            filter_price_min: value
		        }, () => {
		            if(event.type === 'blur' && this.state.filter_price_max !== null && this.state.filter_price_max < value) {
		                this.setState({
				            filter_price_max: value
				        });
			        }
		        });
		    }
	    }
    }

    updatePriceMax(event) {
    	event.persist();
    	let value = event.target.value;

    	if(event.type === 'dblclick') {
    		this.setState({
	            filter_price_max: null
	        });
	    } else {
	        if(!isNaN(value) && (function(x) { return (x | 0) === x; })(parseFloat(value))) {

		        this.setState({
		            filter_price_max: value
		        }, () => {
		            if(event.type === 'blur' && this.state.filter_price_min !== null && this.state.filter_price_min > value) {
		                this.setState({
				            filter_price_min: value
				        });
			        }
		        });
		    }
	    }
    }

    render() {
    	if(this.state.isLoading) return (<Loading />);
        if(this.state.error) return <p>{this.state.error}</p>;

        let items = [];
        if(!this.state.isLoading) {
	        Object.keys(this.state.items).forEach((key, i) => {
	            let item = this.state.items[key];
	            if(
		            (!this.state.filter_search || item.name.toLowerCase().indexOf(this.state.filter_search.toLowerCase()) !== -1)
		            && (!this.state.filter_type || item.type === this.state.filter_type)
		            && (!this.state.filter_rarity || item.rarity === this.state.filter_rarity)
		            && (!this.state.filter_wear || item.wear_tier_index === this.state.filter_wear)
		            && (!this.state.filter_price_min ||item.credits >= this.state.filter_price_min)
		            && (!this.state.filter_price_max || item.credits <= this.state.filter_price_max)
	            ) {
		            items.push(
		                <UserContext.Consumer key={i}>
		                    {user =>
			                    <ItemBlock type={'p'} item={item} user={user} />
		                    }
	                    </UserContext.Consumer>
		            );
	            }
	        });
        }

        let self = this;

        return (
            <main id="store-page">
	            <div className="container is-widescreen is-fullhd">
		            <div className="container is-fluid vl-content">
			            <div className="columns is-marginless vl-store">
							<div className={'column is-paddingless vl-sidebar' + (this.state.menuOpen===true ? ' is-active' : '')}>
					            <div className="container vl-container">
						            <div className="header">
							            <div className="has-text-weight-bold">Filters</div>
						            </div>
						            <ul className={'store-filter is-unselectable'} style={{display: (this.state.filters ? 'block' : 'none')}}>
							            {/*<li className={'store-filter-menu'}>
								            <div className={'store-filter-head'}>Game</div>
								            <ul className={'store-filter-submenu'}>
									            <li className={'store-filter-item'}>VGO</li>
								            </ul>
							            </li>*/}
							            {this.state.filters.type ?
								            <li className={'store-filter-menu'}>
									            <div className={'store-filter-head'}>Type</div>
									            <ul className={'store-filter-submenu'}>
										            {this.state.filters.type.map(function(name, i){
														return <li className={'store-filter-item' + (self.state.filter_type===name ? ' is-active' : '')} key={i} onClick={self.setFilterType} data-id={name}>{name}</li>;
													})}
									            </ul>
								            </li>
							            :
							                null
							            }
							            {this.state.filters.rarity ?
								            <li className={'store-filter-menu'}>
									            <div className={'store-filter-head'}>Rarity</div>
									            <ul className={'store-filter-submenu'}>
										            {this.state.filters.rarity.map(function(name, i){
														return <li className={'store-filter-item' + (self.state.filter_rarity===name ? ' is-active' : '')} key={i} onClick={self.setFilterRarity} data-id={name}>{name}</li>;
													})}
									            </ul>
								            </li>
							            :
							                null
							            }
							            {this.state.filters.wear ?
								            <li className={'store-filter-menu'}>
									            <div className={'store-filter-head'}>Exterior</div>
									            <ul className={'store-filter-submenu'}>
										            {Object.keys(this.state.filters.wear).map(function(key, i){
														let name = self.state.filters.wear[key];
											            return <li className={'store-filter-item' + (self.state.filter_wear===parseInt(key) ? ' is-active' : '')} key={i} onClick={self.setFilterWear} data-id={parseInt(key)}>{name}</li>;
													})}
									            </ul>
								            </li>
							            :
							                null
							            }
							            <li className={'store-filter-menu'}>
								            <div className={'store-filter-head'}>Price</div>
								            <div className={'store-filter-price'}>
									            <input type="number" placeholder="Min Price" title="Min Price" value={this.state.filter_price_min || ''} onChange={this.updatePriceMin} onBlur={this.updatePriceMin} onDoubleClick={this.updatePriceMin} />
									            <input type="number" placeholder="Max Price" title="Max Price" value={this.state.filter_price_max || ''} onChange={this.updatePriceMax} onBlur={this.updatePriceMax} onDoubleClick={this.updatePriceMin} />
								            </div>
							            </li>
						            </ul>
						            <div className="is-hidden-tablet has-text-centered">
							            <button type="button" className="button is-primary vl-apply" onClick={this.closeMenu}>Apply</button>
						            </div>
					            </div>
				            </div>
				            <div className="column is-paddingless">
								<section className="section is-paddingless">
									<div className="vl-menu is-hidden-tablet">
										<img src="/img/icon_filter.png" className="is-pulled-right" alt="filter" title="Filter" onClick={this.openMenu} />
										<h2 className="title is-size-4 vl-heading">Store</h2>
									</div>
									<div className="vl-search is-pulled-right">
										<div className="columns is-mobile">
											<div className="column has-text-left is-paddingless vl-search-input">
												<input type="text" value={this.state.filter_search || ''} onChange={this.updateSearch} onDoubleClick={this.updateSearch} />
											</div>
											<div className="column has-text-right is-paddingless vl-search-button">
												<div className="fa fa-search"></div>
											</div>
										</div>
									</div>
									<h2 className="title is-size-4 vl-heading is-hidden-mobile">Store</h2>
									<div>
							            {this.state.isLoading ? <Loading /> : null}
							            <div style={{display: (this.state.isLoading ? 'none' : 'block')}}>
								            <div className="vl-item-container">
									            {items}
								            </div>
						                </div>
						            </div>
					            </section>
				            </div>
			            </div>
		            </div>
	            </div>
            </main>
        );
    }
}
