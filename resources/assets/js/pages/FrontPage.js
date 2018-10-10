import React from 'react';
import MatchBlock from './FrontPage/MatchBlock';
import MatchBlockRow from './FrontPage/MatchBlockRow';
import TopMenu from './FrontPage/TopMenu';
import SideMenu from './FrontPage/SideMenu';
/*
 * The Front Page this is the default match view.
 * This page will then call the BlockView which comes from MatchBlock or in a horizontal MatchBlockRow view
 * There is also a TopMenu or DropDownMenu
 *
 */
export default class FrontPage extends React.Component {
    menuItemClick(item){
        let key = item.key;
        let type =item.type;
        let filtertype = item.filterType;
        if(type == "navigation"){
            this.loadPage(key);
        }
        else if(type == "filter"){
            let obj = {};
            obj[filtertype] = key;
            this.setState(obj);
        }
    }
    constructor(props) {
        super(props);
        this.menuItemClick = this.menuItemClick.bind(this);
        this.id = props.id;
        let menuitems = [{
            'id':'live_menu',
            'defaultText':'Live',
            'expanded':true,
            'align':'left',
            'defaultIcon':'fa-exclamation',
            'menu':[{
                text:" Live ",
                'icon':'fa-eye',
                'key':'live',
                'type':'navigation',
                'disabled': false,
                "onclick":this.menuItemClick
            },
                {
                    text:" Upcoming ",
                    'key':'upcoming',
                    'type':'navigation',
                    'icon':'fa-fast-forward',
                    'disabled': false,
                    "onclick":this.menuItemClick
                },
                {
                    text:" Past",
                    'key':'past',
                    'type':'navigation',
                    'icon':'fa-clock',
                    'disabled': false,
                    "onclick":this.menuItemClick
                }]},
            {
                'id':'game_menu',
                'align':'left',
                'defaultText':'Game',
                'expanded':false,
                'defaultIcon':'fa-steam-symbol',
                'menu':[{
                    text: " CSGO ",
                    'icon': 'fa-steam-symbol',
                    'key':'game-csgo',
                    'type':'filter',
                    'filterType':'game',
                    'disabled': false,
                    "onclick": this.menuItemClick
                }]
            },
            {
                'id':'tournament_menu',
                'defaultText':'League',
                'expanded':false,
                'align':'right',
                'type':'filter',
                'filterType':'league',
                'defaultIcon':'fa-chess-king',
                'menu':[]
            }
        ];
        this.menus = menuitems;
        this.state = {
            'search':'',
            'status':'',
            'game':'',
            'league':'',
            'isloading':false,
            'menu':this.menus,
            'view':'stacked',
            matches:[]
        };
        this.viewChangeClick = this.viewChangeClick.bind(this);
        this.handleData = this.handleData.bind(this);
    }
    componentDidMount(){
        this.loadPage("past");
    }
    getUrl(page){
        if(page == "live"){
            return "/api/Matches/LiveMatches";
        }
        else if(page == "past"){
            return "/api/Matches/PastMatches";
        }
        else if(page == "upcoming"){
            return "/api/Matches/UpcomingMatches";
        }
    }
    loadPage(page){
        this.currentPage = page;
        this.setState({isloading:true});
        this.loadData(this.getUrl(page),page);
    }
    applyFilters(data){
        let final_dat = [];
        let me = this;
        if(this.state.search != "" || this.state.game != '' || this.state.league != ''){
            final_dat = data.filter(function(i) {
                if(me.state.search != ""){
                    let sterm = me.state.search;
                    if(i.name.toUpperCase().indexOf(sterm.toUpperCase()) != -1 ||
                        i.league.name.toUpperCase().indexOf(sterm.toUpperCase()) != -1 ||
                        i.series.name.toUpperCase().indexOf(sterm.toUpperCase()) != -1 ||
                        i.tournament.name.toUpperCase().indexOf(sterm.toUpperCase()) != -1 ||
                        i.team1.name.toUpperCase().indexOf(sterm.toUpperCase()) != -1 ||
                        i.team2.name.toUpperCase().indexOf(sterm.toUpperCase()) != -1
                        )
                    {
                        return true;
                    }
                    else
                        return false;
                }
                if(me.state.league != ''){
                    let sterm = me.state.league;
                    if(i.league.name.toUpperCase().indexOf(sterm.toUpperCase()) != -1){
                        return true;
                    }
                    else
                        return false;
                }
                if (me.state.game != ''){
                    return true;
                }
            });
        }
        else {
            final_dat = data;
        }
        return final_dat;
    }
    getLeagueList(data){
        let league_list = [];
        for(let i=0; i < data.length; i++){
            if(league_list.indexOf(data[i].league.name) == -1){
                league_list.push(data[i].league.name);
            }
        }
        return league_list;
    }
    getGamesList(data){
        return ['CSGO'];
    }
    handleData(data){
        if(data.status == "1"){
            let res = data.response;
            let matches = data.response.matches;
            //let final_data = this.applyFilters(data);
            let leagues = this.getLeagueList(matches);
            let games = this.getGamesList(matches);
            let menu_copy = this.state.menu;
            for(let i =0; i < menu_copy.length; i++){
                if(menu_copy[i].id == "tournament_menu"){
                    let final_menu = [{
                        text: 'All',
                        'icon': 'fa-trophy',
                        'key':'',
                        'type':'filter',
                        'filterType':'league',
                        'disabled': false,
                        "onclick": this.menuItemClick}];
                    for(let c=0; c < leagues.length; c++){
                        final_menu.push({
                            text: leagues[c],
                            'icon': 'fa-trophy',
                            'key':leagues[c],
                            'type':'filter',
                            'filterType':'league',
                            'disabled': false,
                            "onclick": this.menuItemClick
                        });
                    }
                    menu_copy[i].menu = final_menu;
                }
            }
            this.setState({matches:matches,menu:menu_copy,isloading:0});
        }
    }
    viewChangeClick(e){
        let target = e.currentTarget;
        let view = $(target).attr('data-view');
        this.setState({view:view});
    }
    loadData(url,page){
        let me = this;
        $.ajax({url:url,"success":function(res){
            me.handleData(res);
        },"error":function(){
            console.log("opps something went wrong in fetch match data");
        }})
    }
    render() {
        let matches = this.applyFilters(this.state.matches);
        if(this.state.isloading){
            return (<div className="fullscreen-block has-text-centered has-text-white" style={{"padding":"20px"}}><span className="fa fa-spinner fa-spin fa-4x"/></div>);
        }
        let isstacked = "";
        let isrow = "";
        if(this.state.view == "stacked")
            isstacked = "is-selected";
        else
            isrow = "is-selected";

        let viewicons = (<div className="columns is-hidden-mobile">
            <div className="column is-fullwidth">
                <div className="is-pulled-right side-icons">
                    <div className={"stacked-icon display-icon clickable "+isstacked} onClick={this.viewChangeClick} data-view="stacked"></div>
                    <div className={"row-icon display-icon clickable "+isrow} onClick={this.viewChangeClick} data-view="row"></div>
                </div>
            </div>
        </div>);
        let match_block = [];
        if(this.state.view == "stacked"){
            let temp_match_block = [];
            for(let i =0; i < matches.length; i++){
                if((i % 3) == 0 && i > 0) {
                    match_block.push(<div key={"match_block_rows_"+i} className="match-block-container"><div className="max-width">{temp_match_block}</div></div>);
                    temp_match_block = [];
                }
                temp_match_block.push(<MatchBlock key={"match_id_"+matches[i].id} match={matches[i]}/>);
            }
            if(match_block.length == 0 && matches.length != 0){
                match_block.push(<div key={"match_block_rows_"+1} className="match-block-container"><div className="max-width">{temp_match_block}</div></div>);
            }
            //let finalele =<div>{match_block}</div>;
            //match_block = match_block;
        }
        else {
            for(let i =0; i < matches.length; i++){
                match_block.push(<MatchBlockRow key={"match_id_"+matches[i].id}  match={matches[i]}/>)
            }
        }
        return (<div id="front_page">
            <div className='is-fullwidth has-text-centered content'>
            <br/>
                <span className='heading-h1'>MATCHES</span>
            </div>
            <div className="columns is-mobile is-hidden-desktop">
                <div className="column has-text-centered">
                    <TopMenu menuitems={this.state.menu} />
                </div>
            </div>
            {viewicons}
            <div className="columns">
                <div className="column is-2-desktop" style={{"paddingLeft":"10px"}}>
                    <div className="is-hidden-mobile">
                        <SideMenu menuitems={this.state.menu}/>
                    </div>
                </div>
                <div className="column is-1-desktop"></div>
                <div className="column is-9-desktop">
                    {match_block}
                </div>
            </div>
        </div>);
    }
}