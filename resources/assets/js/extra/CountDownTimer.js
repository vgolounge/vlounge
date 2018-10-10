import React from 'react';

export default class CountDownTimer extends React.Component {
    constructor(props){
        super(props);
        this.id = props.id;
        this.timer = null;
        this.state = {
            isLive : props.islive,
            timeStamp : props.timestamp
        };
        this.timerTick = this.timerTick.bind(this);
    }
    timerTick(){
        this.forceUpdate();
    }
    componentDidMount(){
        if(!this.state.isLive){
            let dt = moment.utc(this.state.timeStamp).local();
            let now = moment();
            if(now.isBefore(dt)){
                this.timer = setInterval(this.timerTick,1000);
            }
        }
    }
    componentWillUnmount(){
        clearInterval(this.timer);
    }
    render(){
        if(this.state.isLive)
            return (<div><div className="live-green-dot"></div> Live</div>);
        else {
            let dt = moment.utc(this.state.timeStamp).local();
            let now = moment();
            if(now.isBefore(dt)) {
                let out ="";
                let duration = moment.duration(dt.diff(now));
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
                return (<span>{out}</span>);
            }
            else
                return (<span>Match Over</span>);
        }
    }
}