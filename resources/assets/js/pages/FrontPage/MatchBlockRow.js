import React from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom'
import BetButton from './../../extra/BetButton';
import CountDownTimer from './../../extra/CountDownTimer';
/*
 * This is the horizontal view of the match.
 *
 */
export default class MatchBlockRow extends React.Component {
    constructor(props){
        super(props);
        this.id = props.id;
        this.state = {
            match : props.match
        };
    }
    render(){
        let team1image = this.state.match.team1.image.indexOf("http") == -1?"http://thisistest.vlounge.gg"+this.state.match.team1.image:this.state.match.team1.image;
        let team2image = this.state.match.team2.image.indexOf("http") == -1?"http://thisistest.vlounge.gg"+this.state.match.team2.image:this.state.match.team2.image;

        return (<div className="match-block-hori is-fullwidth">
                <Link to={`/match/${this.state.match.id}`}>
                    <table className="is-fullwidth">
                        <tbody>
                        <tr>
                            <td width='156px;' align="center" valign='center' className="has-text-centered">
                                <span className="timer-hori"><CountDownTimer islive={this.state.match.is_live} timestamp={this.state.match.begins_at}/></span>
                                <div className="game-image" style={{"backgroundImage":"url(/img/csgo.png)"}}></div>
                            </td>
                            <td width='104px;'  align="center" className="has-text-centered">
                                <span className="odd-text-deaktop">x {this.state.match.match_bet[this.state.match.team1.id] && this.state.match.match_bet[this.state.match.team1.id].odds[this.state.match.team1.id]?this.state.match.match_bet[this.state.match.team1.id].odds[this.state.match.team1.id]:"1.00"}</span><br/>
                                <BetButton pick_id={this.state.match.team1.id} definition={this.state.match.match_bet} />
                            </td>
                            <td width='130px;' align="center" className="has-text-centered">
                                <div className="team-image-hori" style={{"backgroundImage":"url("+team1image+")"}}></div>
                                <span className="team-name-hori">{this.state.match.team1.name}</span>
                            </td>
                            <td width='250px;' align="center" className="has-text-centered">
                                <span className="match-score">{this.state.match.score[0].value}-{this.state.match.score[1].value}</span><br/>
                                <span>
                                    <span className="tournament-name-hori">{this.state.match.league.name}</span><br/>
                                </span>
                            </td>
                            <td width='130px;'  align="center" className="has-text-centered">
                                <div className="team-image-hori" style={{"backgroundImage":"url("+team2image+")"}}></div>
                                <span className="team-name-hori">{this.state.match.team1.name}</span>
                            </td>
                            <td width='104px;' align="center" className="has-text-centered">
                                <span className="odd-text-deaktop">x {this.state.match.match_bet[this.state.match.team2.id] && this.state.match.match_bet[this.state.match.team2.id].odds[this.state.match.team2.id]?this.state.match.match_bet[this.state.match.team2.id].odds[this.state.match.team2.id]:"1.00"}</span><br/>
                                <BetButton pick_id={this.state.match.team2.id} definition={this.state.match.match_bet} />
                            </td>
                            <td width='93px;'align="center" className="has-text-centered">
                                <Link to={`/match/${this.state.match.id}`}><div className="stream-icon-hori" style={{"backgroundImage": "url('/svg/stream icon.svg')"}}></div></Link>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </Link>
        </div>);
    }
}