import React from 'react';
import BulmaDropDown from './BulmaDropDown';
/*
 Top menu shown when the site is being viewed in the mobile view.
 This calls the BulmaDropDown menu system
 */
export default class TopMenu extends React.Component {
    constructor(props){
        super(props);
        this.id = props.id;

        this.state = {menus : props.menuitems};
    }
    render(){
        let menus = [];
        for(let i=0; i < this.state.menus.length; i++){
            menus.push(<BulmaDropDown key={"menu_"+i} align={this.state.menus[i].align} id={this.state.menus[i].id} menu={this.state.menus[i].menu} defaultText={this.state.menus[i].defaultText} defaultIcon={this.state.menus[i].defaultIcon} />);
        }
        return (
            <div id={this.id} className="grouped-dropdowns" style={{marginLeft:"auto",marginRight:"auto"}}>
                {menus}
            </div>
        );
    }
}