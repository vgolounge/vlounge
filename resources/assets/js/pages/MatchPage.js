import React from 'react';

import BetButton from '../extra/BetButton';
import Loading from "../extra/Loading";

import OtherBets from './MatchPage/OtherBets';
import MatchTabs from './MatchPage/MatchTabs';

import {betTimerTick} from '../helper'
import local from '../localization'

export default class MatchPage extends React.Component {
    constructor(props) {
        super(props);

        this.matchId = props.match.params.matchId
        this.main_definition = null

        this.state = {
            data: null,
            bet_definitions: null,

            isLoading: true,
            error: null,
        }
        this.fetchBetsData = this.fetchBetsData.bind(this)
    }

    componentDidUpdate(prevProps){
        if (this.props.match.params.matchId !== prevProps.match.params.matchId)
        {
            this.matchId = this.props.match.params.matchId
            this.main_definition = null

            this.setState({
                data: null,
                bet_definitions: null,
                isLoading: true,
                error: null,
            })
            this.fetchMatchData();
        }
    }

    componentDidMount(){
        if(this.state.isLoading)
            this.fetchMatchData()
        else
            this.fetchBetsData()
    }

    fetchMatchData(){
        fetch(`/api/Matches/GetMatchDetails?id=${this.matchId}`, {
            method: "GET"
        }).then(result => {
            return result.json()
        }).then(data => {
            if(data.status === 1) {
                this.setState({
                    data: data.response,
                    isLoading: false
                });
                this.fetchBetsData()
            }
            else
                this.setState({
                    error: "Error on fetch",
                    isLoading: false
                });
        }).catch(error => {
            this.setState({
                error: "Error on fetch (catch)",
                isLoading: false
            });
        })
    }
    fetchBetsData(){
        fetch(`/api/Matches/GetBettingData?match_id=${this.matchId}`, {
            method: "GET"
        }).then(result => {
            return result.json()
        }).then(data => {
            if(data.status === 1)
            {
                data.response.definitions.forEach(definition => {
                    if (definition.type === 1) this.main_definition = definition
                })
                this.setState({
                    bet_definitions: data.response.definitions
                });
            }
        }).catch(error => {

        })
    }

    render() {
        console.log("RENDER PAGE");

        if(this.state.isLoading) return <Loading/>
        if(this.state.error) return <p>{this.state.error}</p>

        let total_bets, number_of_bets, average_bet;

        if(this.state.bet_definitions !== null)
        {
            total_bets = 0
            number_of_bets = 0
            this.state.bet_definitions.forEach(definition => {
                total_bets += definition.bets_credits
                number_of_bets += definition.bets_count
            })
            if(number_of_bets !== 0)
                average_bet = Math.floor(total_bets/number_of_bets)
            else
                average_bet = 0
        }
        else
            total_bets = number_of_bets = average_bet = (<i className="fa fa-spin fa-spinner"></i>)

        return (
            <main id="match-page">
                <div className="white-box">
                    <div className="match-header columns is-mobile is-multiline">
                        <div className="column is-narrow">
                            <span className="match-status">
                                <MatchStatus begins_at={this.state.data.begins_at} closes_at={this.state.data.closes_at} status={this.state.data.status} />
                            </span>
                        </div>
                        <div className="column is-12-mobile is-narrow-tablet">
                            <h1>{this.state.data.league.name}</h1>
                            <h2>{this.state.data.tournament.name}</h2>
                        </div>

                        <div className="column is-narrow">
                            <img
                                src="http://vignette1.wikia.nocookie.net/logopedia/images/b/bc/Counter-Strike_Global_Offensive.png/revision/latest?cb=20150828062514"
                                alt="CS:GO" className="match-game-logo" />
                        </div>
                    </div>

                    <div className="match-stats columns is-mobile">
                        <div className="column is-half-mobile">
                            <div className="stat-label">{local.TIME_LEFT_TO_BET}</div>
                            <div className="stat-value">
                                <MainBetStatus closes_at={this.main_definition ? this.main_definition.closes_at : null} opens_at={this.main_definition ? this.main_definition.opens_at : null} />
                            </div>
                        </div>
                        <div className="column is-half-mobile">
                            <div className="stat-label">{local.TOTAL_BETS_IN_BANK}</div>
                            <div className="stat-value">{total_bets} C</div>
                        </div>
                        <div className="column is-half-mobile">
                            <div className="stat-label">{local.NUMBER_OF_BETS}</div>
                            <div className="stat-value">{number_of_bets}</div>
                        </div>
                        <div className="column is-half-mobile">
                            <div className="stat-label">{local.AVERAGE_BET}</div>
                            <div className="stat-value">{average_bet} C</div>
                        </div>
                    </div>


                    <div className="match-teams columns is-mobile is-centered">
                        <div className="column is-narrow">
                            <img src={this.state.data.team1.image} alt={this.state.data.team1.name} className="team-logo" />
                            <span className="team-name">{this.state.data.team1.name}</span>
                            <div className="team-odds">
                                {local.ODDS} X <span className="odds">{ this.main_definition ? (this.main_definition.odds[this.state.data.team1.id] || 1.00) : '' }</span>
                            </div>
                            <BetButton pick_id={this.state.data.team1.id} definition={this.main_definition} fetchBetsData={this.fetchBetsData}/>
                        </div>
                        <div className="column is-narrow match-score-column">
                            <div className="match-score">{this.state.data.score[0].value}:{this.state.data.score[1].value}</div>

                            {this.state.data.streams.length && (
                                <a href={this.state.data.streams[0].url} target="_blank" className="is-hidden-tablet">
                                    <img src="/img/ic_stream.svg" alt={local.STREAM} />
                                </a>
                            )}
                        </div>

                        <div className="column is-narrow">
                            <img src={this.state.data.team2.image} alt={this.state.data.team2.name} className="team-logo" />
                            <span className="team-name">{this.state.data.team2.name}</span>
                            <div className="team-odds">
                                ODDS X <span className="odds">{ this.main_definition ? (this.main_definition.odds[this.state.data.team2.id] || 1.00) : '' }</span>
                            </div>
                            <BetButton pick_id={this.state.data.team2.id} definition={this.main_definition} fetchBetsData={this.fetchBetsData}/>
                        </div>
                    </div>
                </div>

                <OtherBets definitions={this.state.bet_definitions} />

                {this.state.data.streams.length != 0 && (
                    <iframe src={this.state.data.streams[0].url+ "&autoplay=false"} scrolling="0" allowFullScreen
                            width="100%" height="700" className="match-stream is-hidden-mobile"></iframe>
                )}


                <MatchTabs match={this.state.data} main_definition={this.main_definition} />

            </main>
        );
    }
}

class MatchStatus extends React.Component {

    constructor(props){
        super(props);

        this.timerID = null

        this.state = {
            status: props.status
        }
    }

    componentDidMount() {
        if (this.props.status == 'Upcoming' && this.props.begins_at)
            this.timerID = setInterval(() => this.tick(), 1000);
    }
    componentWillUnmount() {
        if (this.timerID)
            clearInterval(this.timerID);
    }
    tick() {
        let status
        const dt = moment.utc(this.props.begins_at).local();
        const now = moment();
        const duration = moment.duration(dt.diff(now));

        if(now.isBefore(dt)) {
            let out = "";
            if (duration.get('days') > 0) {
                out += duration.get("days") + "d ";
                out += duration.get("hours") + "h ";
                out += duration.get("minutes") + "m ";
                out += duration.get("seconds") + "s";
            }
            else if (duration.get("hours") > 0) {
                out += duration.get("hours") + "h ";
                out += duration.get("minutes") + "m ";
                out += duration.get("seconds") + "s";
            }
            else if (duration.get("minutes") > 0) {
                out += duration.get("minutes") + "m ";
                out += duration.get("seconds") + "s";
            }
            else if (duration.get("seconds") > 0) {
                out += duration.get("seconds") + "s";
            }
            status = local.STARTS_IN + ' ' + out
        }
        else {
            clearInterval(this.timerID)
            this.timerID = null
            status = this.props.status
        }
        this.setState({
            status: status
        })
    }

    render(){
        return this.state.status
    }
}

class MainBetStatus extends React.Component {
    constructor(props){
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
        if(this.props.closes_at)
        {
            if (this.state.status !== local.LOCKED)
                this.setState({
                    status: betTimerTick(this.props.closes_at, this.props.opens_at, this.timerID)
                })
            else
                clearInterval(this.timerID);
        }

    }

    render(){
        return this.state.status
    }
}


