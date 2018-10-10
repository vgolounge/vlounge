import React from 'react';
import ReactDOM from 'react-dom';

import local from '../localization'

const modalRoot = document.getElementById('modal-root')

export class Modal extends React.Component {
    constructor(props) {
        super(props);

        this.el = document.createElement('div');
    }


    componentDidMount() {
        modalRoot.appendChild(this.el);
    }

    componentWillUnmount() {
        modalRoot.removeChild(this.el);
    }

    render() {
        return ReactDOM.createPortal(
            <div className={`modal modal-placebet ${this.props.isOpen ? 'is-active' : ''}`}>
                <div className="modal-background" onClick={this.props.toggleModal} />
                {this.props.children}
            </div>,
            this.el,
        );
    }
}

export class PlaceBetModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            amount: '',
            payout: ''
        }

        this.handleClick = this.handleClick.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    handleClick(e){
        console.log("CLICK");
        if(this.props.user.data)
        {
            if (this.state.amount > 0 && this.state.amount <= this.props.user.data.credits)
            {
                this.props.toggleModal()

                const form = new FormData()
                form.append('definition', this.props.definition.id)
                form.append('pick', this.props.pick_id)
                form.append('amount', this.state.amount)

                fetch("/api/Bet/PlaceBet", {
                    method: 'POST',
                    body: form
                }).then(result => {
                    return result.json()
                }).then(data => {
                    if(data.status === 1)
                    {
                        this.props.user.data.credits = data.response.credits;
                        if(this.props.fetchBetsData)
                            this.props.fetchBetsData()
                    }
                }).catch(error => {

                })
            }
        }
        else
        {
            window.location.href = "/login"
        }
    }

    handleChange(e){
        const amount = e.target.value
        let payout = ''
        if(amount)
        {
            const odds = this.props.definition.odds[this.props.pick_id] || "1.00"
            payout = Math.floor(amount * odds)
        }

        this.setState({
            amount: amount,
            payout: payout
        })
    }

    render() {
        return (
            <div className="modal-content modal-placebet">
                <button className="modal-close is-large" aria-label="close" onClick={this.props.toggleModal} />

                <div className="tournament-title">{this.props.tournament}</div>
                <div className="bet-side">{local.BET_SIDE}: {this.props.definition.options[this.props.pick_id].desc}</div>
                <div className="odds">{local.ODDS}: {this.props.definition.odds[this.props.pick_id] || "1.00"}</div>

                <div className="columns is-multiline">
                    <div className="column is-6">
                        <label>
                            {local.BET_AMOUNT}
                            <input type="number" value={this.state.amount} required onChange={this.handleChange} placeholder={local.CREDITS}/>
                        </label>
                    </div>
                    <div className="column is-6">
                        <label>
                            {local.PAYOUT}
                            <input type="number" value={this.state.payout} readOnly/>
                        </label>
                    </div>
                    <div className="column is-6 ">
                        <button onClick={this.handleClick} className="confirm-bet">{local.PLACE_BET}</button>
                    </div>
                </div>
            </div>
        )
    }
}