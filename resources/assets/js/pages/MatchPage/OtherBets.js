import React from 'react'
import BetButton from '../../extra/BetButton'

import {betTimerTick} from '../../helper'
import local from '../../localization'

export default class OtherBets extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        if(!this.props.definitions) return ''

        let rows = []
        this.props.definitions.forEach((definition, i) => {
            if(definition.type != 1)
                rows.push(<OtherBetRow definition={definition} key={i} />)
        })
        return (
            <div className="columns is-mobile other-bets">
                {rows}
            </div>
        )
    }
}

class OtherBetRow extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            isClose: true,
            status: ''
        }

        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        this.timerID = setInterval(() => this.tick(), 1000);
    }
    componentWillUnmount() {
        clearInterval(this.timerID);
    }
    tick() {
        if(this.state.status !== local.LOCKED)
        {
            this.setState({
                status: betTimerTick(this.props.definition.closes_at, this.props.definition.opens_at, this.timerID)
            })
        }
    }

    handleClick() {
        this.setState({
            isClose: !this.state.isClose
        });
    }

    render(){
        let options = []
        if(!this.state.isClose)
            Object.keys(this.props.definition.options).forEach((key) => {
                options.push(<OtherBetRowOption definition={this.props.definition} id={key} key={key} />)
            })

        return (
            <div className="column is-12">
                <div className="white-box">
                    <div className="bet-description">
                        <div className="bet-title">{this.props.definition.desc}</div>
                        <div className="bet-status">{this.state.status}</div>
                        <button className="button-bet small outline" onClick={this.handleClick}>{this.state.isClose ? local.BET : '-'}</button>
                    </div>
                    <div className="bet-choices">
                        {options}
                    </div>
                </div>
            </div>
        );
    }
}
class OtherBetRowOption extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        const option = this.props.definition.options[this.props.id]
        const odds = this.props.definition.odds[option.pick] || "1.00"

        return (
            <div className="columns is-mobile is-multiline bet-choice">
                <div className="column bet-title">{option.desc}</div>
                <div className="column is-narrow is-6-mobile bet-credits">{local.CREDITS_BET}: {option.bets_credits}</div>
                <div className="column is-6-mobile bet-odds">
                    {local.CURRENT_ODDS} X <span className="odds">{odds}</span>
                </div>
                <div className="column is-6-mobile">
                    <BetButton pick_id={option.pick} definition={this.props.definition} style="small" />
                </div>
            </div>
        );
    }
}