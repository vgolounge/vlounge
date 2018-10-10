import React from 'react';

import {UserContext} from './UserContext'
import {Modal, PlaceBetModal} from './Modal';

import local from '../localization'

export default class BetButton extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            isOpen: false
        }

        this.toggleModal = this.toggleModal.bind(this)
    }

    toggleModal() {
        this.setState({
            isOpen: !this.state.isOpen
        })
    }

    render(){
        if(!this.props.definition) return ''

        return (
            <div>
                <button onClick={ this.toggleModal } className={'button-bet '+(this.props.style || '')} disabled={!this.props.definition.is_active}>{local.BET}</button>

                { this.props.definition.is_active && (
                <UserContext.Consumer>
                    {user =>
                        <Modal isOpen={this.state.isOpen} toggleModal={this.toggleModal}>
                            <PlaceBetModal definition={this.props.definition} pick_id={this.props.pick_id} user={user} toggleModal={this.toggleModal} fetchBetsData={this.props.fetchBetsData}/>
                        </Modal>
                    }
                </UserContext.Consumer>
                )}
            </div>
        );
    }
}