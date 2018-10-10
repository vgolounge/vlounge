import React from 'react';

export default class Loading extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            color: props.color || 'white'
        };
    }

    render(){
        return (
	        <div className="is-fullwidth has-text-centered" style={{padding:"20px",color:this.state.color}}><span className="fa fa-spinner fa-spin fa-4x"/></div>
        );
    }
}