import React from 'react';

import TeamMatchHistory from './TeamMatchHistory';
import {WebsocketContext} from '../MatchPage';

import local from "../../localization";

const matchTabs = [
    {
        id: "history",
        name: local.HISTORY
    },
    {
        id: "bets",
        name: local.BETS
    },
    {
        id: "livefeed",
        name: local.LIVE_FEED
    },
    {
        id: "maps",
        name: local.MAPS
    },
    {
        id: "scorecard",
        name: local.SCORECARD
    }
]

export default class MatchTabs extends React.Component {

    constructor(props){
        super(props);

        this.feed = []
        this.state = {
            currentTab: 'history',
            feed: [],
            scorecard: null
        }

        this.socket = new WebSocket("wss://thisistest.vlounge.gg:8080",'echo-protocol');
        this.socket.onopen = () => {
            if(this.socket != null)
                setTimeout(() => {
                    if(this.socket)
                        this.socket.send("MATCH_ID:"+this.props.match.id)
                }, 250)
        }
        this.socket.onmessage = (e) => {
            const obj = JSON.parse(e.data);
            obj.data = JSON.parse(obj.data);

            if(obj.ts)
                if(obj.type === "log")
                {
                    const log = obj.data.log[0];
                    let message = '';

                    if (log.PlayerQuit)
                    {
                        const pname = log.PlayerQuit.playerName;
                        const side = log.PlayerQuit.playerSide;
                        const color = side == "TERRORIST" ? "t-color" : "ct-color";

                        message = (<div className="match-action"><strong className={color}>{pname}</strong> has left the game!</div>)
                    }
                    else if (log.PlayerJoin) {
                        const pname = log.PlayerJoin.playerName;
                        message = (<div className="match-action"><strong>{pname}</strong> has joined the game!</div>)
                    }
                    else if (log.RoundStart) {
                        message = (<div className="match-action">Round Start!</div>)
                    }
                    else if (log.RoundEnd) {
                        message = (<div className="match-action">Round ended with {log.RoundEnd.winner} by {log.RoundEnd.winType}!</div>)
                        // const twin = log.RoundEnd.counterTerroristScore;
                        // const ctwin = log.RoundEnd.terroristScore;
                        // $("#twins").html(twin);
                        // $("#ctwins").html(ctwin);
                    }
                    else if (log.Kill) {
                        const killer = log.Kill.killerName;
                        const killed = log.Kill.victimName;
                        const kside = log.Kill.killerSide == "CT" ? "ct-color" : "terrorist-color";
                        const vside = log.Kill.victimSide == "CT" ? "ct-color" : "terrorist-color";
                        const weapon = log.Kill.weapon;
                        const headshot = log.Kill.headShot ? "(headshot)" : "";

                        message = (<div className="match-action"><strong className={kside}>{killer}</strong> killed <strong className={vside}>{killed}</strong> with {weapon + headshot}!</div>)

                        // if (l.Kill.victimSide == "CT") {
                        //     $(".ct_player.name").each(function (i, o) {
                        //         if ($(o).html() == killed) {
                        //             $(o).parent().removeClass("dead").addClass("dead");
                        //         }
                        //     });
                        // }
                        // else {
                        //     $(".t_player.name").each(function (i, o) {
                        //         if ($(o).html() == killed) {
                        //             $(o).parent().removeClass("dead").addClass("dead");
                        //         }
                        //     });
                        // }
                    }

                    if(message)
                    {
                        this.feed.push(message)
                        this.updateFeed();
                    }
                }
                else if(obj.type === "scoreboard")
                {
                    this.setState({
                        scorecard: obj.data
                    })
                }
        }

        this.changeTab = this.changeTab.bind(this)
    }


    updateFeed() {
        clearTimeout(this.delayTimer);
        this.delayTimer = setTimeout(() => {
            this.setState({
                feed: this.feed
            })
        }, 1000);
    }

    componentWillUnmount() {
        if (this.socket)
        {
            this.socket.close()
            this.socket = null
        }
    }

    changeTab(tab){
        this.setState({
            currentTab: tab
        })
    }

    render(){
        return <div>
            <MatchPageDesktopTabs
                match={this.props.match} main_definition={this.props.main_definition}
                currentTab={this.state.currentTab} changeTab={this.changeTab}
                feed={this.state.feed} scorecard={this.state.scorecard}
            />
            <MatchPageMobileTabs
                match={this.props.match} main_definition={this.props.main_definition}
                currentTab={this.state.currentTab} changeTab={this.changeTab}
                feed={this.state.feed} scorecard={this.state.scorecard}
            />
        </div>
    }
}


class MatchPageDesktopTabs extends React.Component {
    constructor(props){
        super(props);

        this.handleClick = this.handleClick.bind(this)
    }

    handleClick(e){
        this.props.changeTab(e.target.id.replace('tab-', ''))
    }

    render(){
        let content = ''

        switch (this.props.currentTab){
            case 'maps':
                content = <MatchMaps data={this.props.match.games} />
                break
            case 'bets':
                content = <MatchBets definition={this.props.main_definition} team1={this.props.match.team1} team2={this.props.match.team2} />
                break
            case 'livefeed':
                content = <MatchFeed feed={this.props.feed}/>
                break
            case 'scorecard':
                content = <MatchScorecard scorecard={this.props.scorecard}/>
                break
            case 'history':
                content = (
                    <div className="columns is-mobile team-match-history">
                        <div className="column is-4">
                            <TeamMatchHistory data={this.props.match.h2h} title={local.HEAD_TO_HEAD} />
                        </div>
                        <div className="column is-4">
                            <TeamMatchHistory data={this.props.match.team1_past_matches} title={this.props.match.team1.name} />
                        </div>
                        <div className="column is-4">
                            <TeamMatchHistory data={this.props.match.team2_past_matches} title={this.props.match.team2.name} />
                        </div>
                    </div>
                )
                break
        }

        const list_items = [];
        matchTabs.forEach((tab) => {
            // if(tab.id === 'scorecard' && this.props.match.status !== 'Live')
            //     return;

            const is_active = this.props.currentTab === tab.id;
            list_items.push(<li key={tab.id} id={`tab-${tab.id}`} onClick={this.handleClick}
                                className={is_active ? 'is-active' : ''}>
                <img src={`/img/ic_${tab.id + (is_active ? '_active' : '')}.svg`} alt={tab.name}/>{tab.name}
            </li>)
        })

        return (
            <div className="columns is-hidden-mobile white-box match-tabs-card">
                <ul className="column is-narrow">
                    {list_items}
                </ul>
                <div className="column">
                    {content}
                </div>
            </div>
        )
    }
}

class MatchPageMobileTabs extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            isDropdownOpen: false
        }

        this.toggleDropdown = this.toggleDropdown.bind(this)
        this.handleClick = this.handleClick.bind(this)
    }

    toggleDropdown(e){
        this.setState({
            isDropdownOpen: !this.state.isDropdownOpen
        })
    }
    handleClick(e){
        this.props.changeTab(e.target.id.replace('tab-mobile-', ''))
    }

    render(){
        let content = ''

        switch (this.props.currentTab){
            case 'maps':
                content = <MatchMaps data={this.props.match.games} />
                break
            case 'bets':
                content = <MatchBets definition={this.props.main_definition} team1={this.props.match.team1} team2={this.props.match.team2} />
                break
            case 'livefeed':
                content = <MatchFeed feed={this.props.feed}/>
                break
            case 'scorecard':
                content = <MatchScorecard scorecard={this.props.scorecard}/>
                break
            case 'history':
                content = (
                    <div className="columns is-mobile team-match-history">
                        <div className="column is-narrow">
                            <TeamMatchHistory data={this.props.match.h2h} title={local.HEAD_TO_HEAD} />
                        </div>
                        <div className="column is-narrow">
                            <TeamMatchHistory data={this.props.match.team1_past_matches} title={this.props.match.team1.name} />
                        </div>
                        <div className="column is-narrow">
                            <TeamMatchHistory data={this.props.match.team2_past_matches} title={this.props.match.team2.name} />
                        </div>
                    </div>
                )
                break
        }

        let activeTab = '';
        let tabs = [];
        matchTabs.forEach((tab) => {
            // if(tab.id === 'scorecard' && this.props.match.status !== 'Live')
            //     return;

            tabs.push(<div className="dropdown-item" key={tab.id} onClick={this.handleClick} id={`tab-mobile-${tab.id}`}>
                <img src={`/img/ic_${tab.id}.svg`} alt={tab.name} />{tab.name}
            </div>);
            if(this.props.currentTab === tab.id)
                activeTab = <div><img src={`/img/ic_${tab.id}_active.svg`} alt={tab.name} />{tab.name}</div>
        })

        return (
            <div className="is-hidden-tablet">
                <div className="columns is-mobile is-centered">
                    <div className={`column is-narrow dropdown tabs-selector ${this.state.isDropdownOpen && 'is-active'}`} onClick={this.toggleDropdown}>
                        {activeTab}
                        <div className="dropdown-menu" role="menu">
                            <div className="dropdown-content">
                                {tabs}
                            </div>
                        </div>
                    </div>

                </div>
                {content}
            </div>
        )
    }
}






class MatchMaps extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        if(this.props.data.length == 0) return ''

        let maps = [];
        this.props.data.forEach((map, index) => {
            maps.push(
                <div className="column is-narrow-mobile is-3-tablet" key={index}>
                    <div className="match-map">
                        <div className="match-round">{local.ROUND} {index+1}</div>
                        <div className="match-map-name">{map.map_name}</div>
                    </div>
                </div>
            )
        })
        return (
            <div className="columns is-mobile match-maps">
                {maps}
            </div>
        )
    }
}
class MatchFeed extends React.Component{

    constructor(props){
        super(props)
    }

    render(){
        return (
            <div className="white-box match-action-tracker">
                <div className="match-action-tracker-title">{local.ACTION_TRACKER}</div>
                <div className="match-actions">
                    {this.props.feed}
                </div>
            </div>
        )
    }
}
class MatchScorecard extends React.Component{
    constructor(props){
        super(props)
    }
    render(){
        let terrorists_rows = []
        let ct_rows = []
        if(this.props.scorecard)
        {
            const terrorists = this.props.scorecard.TERRORIST
            terrorists.forEach(function (terrorist, index) {
                terrorists_rows.push(
                    <tr key={index}>
                        <td>{terrorist.name}</td>
                        <td>{terrorist.primaryWeapon}</td>
                        <td>{terrorist.hp}</td>
                        <td>{(terrorist.kevlar ? "Kevlar," : "") + (terrorist.helmet ? "Helmet" : "")}</td>
                        <td>{terrorist.money}</td>
                        <td>{terrorist.score}</td>
                        <td>{terrorist.deaths}</td>
                        <td>{terrorist.assists}</td>
                    </tr>
                )
            })

            const ct = this.props.scorecard.CT
            ct.forEach(function (ct, index) {
                ct_rows.push(
                    <tr key={index}>
                        <td>{ct.name}</td>
                        <td>{ct.primaryWeapon}</td>
                        <td>{ct.hp}</td>
                        <td>{(ct.kevlar ? "Kevlar," : "") + (ct.helmet ? "Helmet" : "")}</td>
                        <td>{ct.money}</td>
                        <td>{ct.score}</td>
                        <td>{ct.deaths}</td>
                        <td>{ct.assists}</td>
                    </tr>
                )
            })
        }

        return (
            <div className="white-box match-score-card">
                <table>
                    <thead>
                        <tr>
                            <th>Player Name</th>
                            <th>Weapon</th>
                            <th>Health</th>
                            <th>Armour</th>
                            <th>Money</th>
                            <th>Kills</th>
                            <th>Assist</th>
                            <th>Deaths</th>
                        </tr>
                    </thead>
                    <tbody>
                        {terrorists_rows}
                    </tbody>
                </table>

                <table>
                    <thead>
                        <tr>
                            <th>Player Name</th>
                            <th>Weapon</th>
                            <th>Health</th>
                            <th>Armour</th>
                            <th>Money</th>
                            <th>Kills</th>
                            <th>Assist</th>
                            <th>Deaths</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ct_rows}
                    </tbody>
                </table>
            </div>
        )
    }
}
class MatchBets extends React.Component{
    constructor(props){
        super(props)
    }

    render(){
        let rows =[]
        if(this.props.definition)
            this.props.definition.bets.forEach((bet, index) => {
                if(rows.length <= 6)
                {
                    rows.push(
                        <div className="columns is-mobile" key={index}>
                            <div className="column">
                                <div className="column-value">{bet.created_at ? moment(bet.created_at).format('LT') : ''}</div>
                            </div>
                            <div className="column">
                                <div className="column-value">{this.props.definition.options[bet.pick].desc}</div>
                            </div>
                            <div className="column">
                                <div className="column-value">{bet.amount} C</div>
                            </div>
                        </div>
                    )
                }
            })

        return (
            <div className="white-box match-bets">
                <div className="columns">
                    <div className="column">
                        <div className="columns is-mobile">
                            <div className="column">
                                <div className="column-title">{local.TIME}</div>
                            </div>
                            <div className="column">
                                <div className="column-title">{local.BET_SIDE}</div>
                            </div>
                            <div className="column">
                                <div className="column-title">{local.AMOUNT}</div>
                            </div>
                        </div>
                        {rows}
                    </div>
                    <div className="column is-4-tablet">
                        <div className="column-title">{local.TOTAL_BETS_PER_TEAM}</div>
                        <div className="teams">
                        {this.props.definition ? [
                            <div className="team" key={1}>
                                <img src={this.props.team1.image} alt={this.props.team1.name}/>
                                <span>{this.props.definition.options[this.props.team1.id].bets_credits || 0} {local.CREDITS}</span>
                            </div>,
                            <div className="team" key={2}>
                                <img src={this.props.team2.image} alt={this.props.team2.name}/>
                                <span>{this.props.definition.options[this.props.team2.id].bets_credits || 0} {local.CREDITS}</span>
                            </div>
                        ] : ' ' }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

