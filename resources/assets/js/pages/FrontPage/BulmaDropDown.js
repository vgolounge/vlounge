import React from 'react';
/*
 This class represents each single MENU in the mobile menu
 This is only visible in the mobile view
 */
export default class BulmaDropDown extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            menuItems : props.menu,
            'defaultText':props.defaultText,
            'defaultIcon':props.defaultIcon,
            'defaultSelected':null
        };
        this.id = props.id;
        this.toggleMenu = this.toggleMenu.bind(this);
        this.menuItemClick = this.menuItemClick.bind(this);
    }
    toggleMenu(e){
        e.stopPropagation();
        console.log(this.id);
        if(!$("#"+this.id).hasClass("is-active"))
            $("#"+this.id).parent().find(".is-active").removeClass("is-active");

        document.querySelector("#"+this.id).classList.toggle('is-active');

    }
    menuItemClick(e){
        var target = e.currentTarget;
        console.log(e);
        var id = $(target).attr("data-id");
        if(id >=0 && id <= this.state.menuItems.length) {
            var menuitem = this.state.menuItems[id];
            if(!menuitem.disabled) {
                this.setState({"defaultSelected": id});
                if (menuitem.onclick)
                    menuitem.onclick(menuitem);
            }
        }
    }
    componentDidMount(){

    }
    render(){
        let menu_list = [];
        let defaultSelected = null;
        for(let i=0; i < this.state.menuItems.length; i++){
            let selected = "";
            if(this.state.defaultSelected && this.state.defaultSelected == i) {
                defaultSelected = this.state.menuItems[i];
                selected = "is-selected";
            }

            menu_list.push(<a key={this.id+"_"+i} href="#" className={"dropdown-item "+selected} onClick={this.menuItemClick} data-id={i}>
                <div className={"fa "+this.state.menuItems[i].icon}></div> {this.state.menuItems[i].text}
            </a>);
        }
        let defText = "";
        let defIcon = "";
        if(defaultSelected != null){
            defText = defaultSelected.text;
            defIcon = <div className={"fa "+defaultSelected.icon}></div>;
        }
        else {
            defText = this.state.defaultText;
            defIcon = <div className={"fa " + this.state.defaultIcon}></div>;
        }
        let alignclass = "";
        if(this.props.align == "right"){
            alignclass = "is-right";
        }
        else
            alignclass = "is-left";
        return (<div className={"dropdown menu-text "+alignclass} id={this.id}>
            <div className="dropdown-trigger">
                <button className="button" aria-haspopup="true" onClick={this.toggleMenu} aria-controls={this.id+"-menu"}>
                    <span id={this.id+"_button_caption"}>{defIcon} {defText}</span>
                    <span className="icon is-small">
                        <i className="fas fa-angle-down dropdown-caret" aria-hidden="true"></i>
                    </span>
                </button>
            </div>
            <div className="dropdown-menu " id={this.id+"-menu"} role="menu" style={{"textAlign":"left"}}>
                <div className="dropdown-content">
                    {menu_list}
                </div>
            </div>
        </div>);
    }
}