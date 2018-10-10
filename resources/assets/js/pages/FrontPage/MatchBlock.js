import React from 'react';
import CountDownTimer from './../../extra/CountDownTimer';
import BetButton from './../../extra/BetButton';

import { BrowserRouter, Route, Link } from 'react-router-dom'
/*
 * The Match Block
   * this is called by the FrontPage.js file.
   * It displays the match as a kinda square block.
 */

export default class MatchBlock extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            match : props.match
        };
    }
    render() {
        let team1image = this.state.match.team1.image.indexOf("http") == -1?"http://thisistest.vlounge.gg"+this.state.match.team1.image:this.state.match.team1.image;
        let team2image = this.state.match.team2.image.indexOf("http") == -1?"http://thisistest.vlounge.gg"+this.state.match.team2.image:this.state.match.team2.image;
        return (
                <div key={this.state.match.id} className="match-block is-inline-block">
                    <Link to={`/match/${this.state.match.id}`}>
                        <div className="match-inner-block">
                            <div className="columns is-mobile">
                                <div className="column">
                                    <CountDownTimer islive={this.state.match.is_live} timestamp={this.state.match.begins_at}/>
                                </div>
                                <div className="column has-text-right" style={{"alignContent": "right"}}>
                                    <div className="game-image" style={{"marginLeft":"auto", "backgroundImage":"url(/img/csgo.png)"}}></div>
                                </div>
                            </div>
                            <div className="columns is-mobile">
                                <div className="column">
                                    <div className="team-image" style={{"marginLeft":"auto", "backgroundImage":"url("+team1image+")"}}></div>
                                </div>
                                <div className="column has-text-centered">
                                    <div className="match-score">{this.state.match.score[0].value}-{this.state.match.score[1].value}</div>
                                </div>
                                <div className="column">
                                    <div className="team-image" style={{"marginLeft":"auto", "backgroundImage":"url("+team2image+")"}}></div>
                                </div>
                            </div>
                            <div className="columns is-mobile" style={{"marginBottom":"0px"}}>
                                <div className="column has-text-centered">
                                    <div className="team-name">{this.state.match.team1.name}</div>
                                </div>
                                <div className="column has-text-centered">
                                    <span className="vs-text"><b>VS</b></span>
                                </div>
                                <div className="column has-text-centered">
                                    <div className="team-name">{this.state.match.team2.name}</div>
                                </div>
                            </div>
                            <div className="columns is-mobile">
                                <div className="column has-text-centered">
                                    <span className="odds-text">x {this.state.match.match_bet[this.state.match.team1.id] && this.state.match.match_bet[this.state.match.team1.id].odds[this.state.match.team1.id]?this.state.match.match_bet[this.state.match.team1.id].odds[this.state.match.team1.id]:"1.00"}</span>
                                </div>
                                <div className="column">
                                </div>
                                <div className="column has-text-centered">
                                    <span className="odds-text">x {this.state.match.match_bet[this.state.match.team2.id] && this.state.match.match_bet[this.state.match.team2.id].odds[this.state.match.team2.id]?this.state.match.match_bet[this.state.match.team2.id].odds[this.state.match.team2.id]:"1.00"}</span>
                                </div>
                            </div>
                            <div className="columns is-mobile">
                                <div className="column has-text-centered">
                                    <BetButton pick_id={this.state.match.team1.id} definition={this.state.match.match_bet} />
                                </div>
                                <div className="column">

                                </div>
                                <div className="column has-text-centered">
                                    <BetButton pick_id={this.state.match.team2.id} definition={this.state.match.match_bet} />
                                </div>
                            </div>
                            <div className="columns is-mobile">
                                <div className="column has-text-centered" style={{"padding":"0px"}}>
                                    <hr className="break-line"/>
                                </div>
                            </div>
                            <div className="columns is-mobile">
                                <div className="column is-9">
                                    <div className="tournament-name">
                                        {this.state.match.league.name}
                                    </div>
                                    <div className="tournament-stage">
                                        {this.state.match.tournament.name}
                                    </div>
                                </div>
                                <div className="column is-3">
                                    <Link to={`/match/${this.state.match.id}`}><div className="stream-icon" style={{"backgroundImage": "url('/svg/stream icon.svg')"}}></div></Link>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            );
    }
}