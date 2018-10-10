import React from 'react';
/*
 side menu only displayed when the site is being viewed in desktop mode.
 this is the menu that shows in the side bar,
 the menu is dynamic it will change the league side menu
 depending on the matches that have been fetched
 */
export default class SideMenu extends React.Component {
    constructor(props) {
        super(props);
        this.id = props.id;
        this.state = {menus:props.menuitems};
        this.menuItemClick = this.menuItemClick.bind(this);
        this.menuClick = this.menuClick.bind(this);
    }
    menuItemClick(e){
        let target = e.currentTarget;
        console.log(e);
        let id = $(target).attr("data-id");
        let menu = $(target).attr("data-menu");
        let menuitem = null;
        if($(target).parent().find(".is-selected").length > 0){
            if(!$(target).hasClass("is-selected"))
                $(target).parent().find(".is-selected").removeClass("is-selected");
        }
        $(target).toggleClass("is-selected");

        for(let i =0; i < this.state.menus.length; i++){
            if(this.state.menus[i].id == menu){
                menuitem = this.state.menus[i].menu[id];
            }
        }

        if(menuitem != null){
            if(!menuitem.disabled) {
                if (menuitem.onclick)
                    menuitem.onclick(menuitem);
            }
        }
    }
    menuClick(e){
        e.preventDefault();
        let id = $(e.currentTarget).attr("data-id");
        $("#sub_menu_"+id).toggleClass("is-hidden");
        if($(e.currentTarget).find(".fa-caret-down").length > 0){
            $(e.currentTarget).find(".fa-caret-down").removeClass("fa-caret-down").addClass("fa-caret-left");
        }
        else {
            $(e.currentTarget).find(".fa-caret-left").removeClass("fa-caret-left").addClass("fa-caret-down");
        }
    }
    render(){
        let menus = [];
        for(let i=0; i < this.state.menus.length; i++){
            let submenu = [];
            let visible = "";
            let caret = "fa-caret-down";
            for(let x =0; x < this.state.menus[i].menu.length; x++){
                let submenuitem = this.state.menus[i].menu[x];
                submenu.push(<li data-menu={this.state.menus[i].id} data-id={x} onClick={this.menuItemClick} key={"sub_menu_"+i+"_"+x}><a><span className="icon is-pulled-left"><i className={"fa "+submenuitem.icon}></i></span> <span className="menu-text">{submenuitem.text}</span></a></li>);
            }
            if(submenu.length > 0) {
                if(!this.state.menus[i].expanded){
                    visible = "is-hidden";
                    caret = "fa-caret-left";
                }
                menus.push(<p data-id={this.state.menus[i].id} key={"side_menu_" + this.state.menus[i].id + "_" + i} className="clickable menu-label" onClick={this.menuClick}><span
                    className={"fa "+caret+" is-pulled-right"}/> {this.state.menus[i].defaultText}</p>);
                menus.push(<ul id={"sub_menu_"+this.state.menus[i].id} key={"side_menu_" + this.state.menus[i].id + "_2_" + i}
                               className={"menu-list "+visible}>{submenu}</ul>);
            }
        }
        return (
            <div className="side-menu">
                <aside className="menu">
                    <p className="menu-label">
                        <b style={{"fontSize":16+"px"}}>Filters</b>
                    </p>
                    <p className="menu-label">&nbsp;</p>
                    {menus}
                </aside>
            </div>);
    }
}