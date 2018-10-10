import React from 'react'

import { Link } from 'react-router-dom'

import local from '../../localization'

export default class TeamMatchHistory extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        let rows = []
        this.props.data.forEach((match, i) => {
            rows.push(<TeamMatchHistoryRow match={match} key={i} />)
        })
        if (rows.length == 0)
            rows = (<div>{local.NO_MATCHES_FOUND}</div>)
        return (
            <div className="white-box">
                <div className="title">{this.props.title}</div>
                {rows}
            </div>
        )
    }
}
class TeamMatchHistoryRow extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return (
            <Link to={`/match/${this.props.match.id}`} className="team-match">
                <div className="columns is-mobile">
                    <div className="column">
                        <img src={this.props.match.team1.image} alt={this.props.match.team1.name} className="team-logo" />
                        <div className="team-name">{this.props.match.team1.name}</div>
                    </div>
                    <div className="column">
                        <div className="match-date">{moment.utc(this.props.match.begins_at).format("DD MMM YY")}</div>
                        <div className="match-score">{this.props.match.score[0].value}:{this.props.match.score[1].value}</div>
                    </div>
                    <div className="column">
                        <img src={this.props.match.team2.image} alt={this.props.match.team2.name} className="team-logo" />
                        <div className="team-name">{this.props.match.team2.name}</div>
                    </div>
                </div>
            </Link>
        )
    }
}