/**
 * Created by nikhil on 20-Jul-18.
 */
class MatchBlock {
    constructor(data){
        this.model = data;
        this.baseurl ='/match/';
        this.countdown_timer = null;
    }

    render(options = null){
        var dt = moment.utc(this.model.begins_at).local();
        var now = moment();
        var out ="";
        if(this.model.score.length > 0) {
            if(options && options.withLink && options.withLink == 1) {
                out += "<a href='" + this.baseurl + this.model.id + "' class='match-link' data-match-id='" + this.model.id + "'>";
            }
            out += "<table border='1' style='table-layout: fixed;' class='table clickable is-fullwidth matchrow'><tbody>\n";
            out += "<tr>\n";
            if (now.isAfter(dt)) {
                //past match
                if(this.model.is_live){
                    out += "<td  class='is-1'><b class='has-text-danger'>LIVE</b></td>";
                }
                out += "<td class='is-2'>\n";
                if (this.model.team1) {
                    out += "<table class='team-block table bg-transparent'><tr><td>" + this.model.team1.name + "</td><Td><img src='" + this.model.team1.image + "' style='height:40px; width:auto;'></Td></tr></table>";
                }
                out += "</td>";
                out += "<td class='is-1 is-centered'><b style='color:" + ((!this.model.draw && this.model.score[0].id == this.model.winner) ? "green" : "red") + "'>" + this.model.score[0]['value'] + "</b></td>";
                out += "<td class='is-1 is-centered'><b>-</b></td>";
                out += "<td class='is-1 is-centered'><b style='color:" + ((!this.model.draw && this.model.score[1].id == this.model.winner) ? "green" : "red") + "'>" + this.model.score[1]['value'] + "</b></td>";
                out += "<td class='is-2 is-centered'>";
                if (this.model.team2) {
                    out += "<table class='team-block table bg-transparent'><tr><Td><img src='" + this.model.team2.image + "' style='height:40px; width:auto;'></Td><td>" + this.model.team2.name + "</td></tr></table>";
                }
                out += "</td>";
                if(options && options.showLeague && options.showLeague ==1)
                    out += "<td class='is-5 is-centered'><table class='table is-fullwidth bg-transparent'><tr><Td><img src='' style='height:40px; width:auto;'></Td><td>" + this.model.league.name + "(" + this.model.tournament.name + ")" + "</td></tr></table></td>";
                if(options && options.matchType && options.matchType == 1)
                    out += "<td class='is-1 has-text-right'> BO" + this.model.number_of_games + "</td>";
            }
            else {
                //upcoming match
                out += "<td  class='is-1'><b>" + dt.format("DD-MM") + "<br>" + dt.format("HH:mm") + "</b><br><b class='countdown-timer' id='countdown_timer_"+this.model.id+"'></b></td>";
                if (this.model.team1) {
                    out += "<td  class='is-2'><table class='table team-block is-fullwidth bg-transparent'><tr><Td class='is-3'><img src='" + this.model.team1.image + "' style='height:40px; width:auto;'></Td><td class='is-9'>" + this.model.team1.name + "</td></tr></table></td>";
                }
                out += "<td class='is-1 is-centered'>VS</td>";
                if (this.model.team2) {
                    out += "<td class='is-2'><table class='team-block table is-fullwidth bg-transparent'><tr><Td class='is-3'><img src='" + this.model.team2.image + "' style='height:40px; width:auto;'></Td><td class='is-9'>" + this.model.team2.name + "</td></tr></table></td>";
                }
                if(options && options.showLeague && options.showLeague ==1)
                    out += "<td class='is-5'><table  class='table is-fullwidth bg-transparent'><tr><Td><img src='' style='height:40px; width:auto;'></Td><td>" +this.model.league.name+ "("+this.model.tournament.name+ ")"+ "</td></tr></table></td>";
                if(options && options.matchType && options.matchType == 1)
                    out += "<td class='is-1 has-text-right'>BO" + this.model.number_of_games + "</td>";
            }
            //out += "<td></td>\n";
            out += "</tr>\n";
            out += "</tbody></table>";
            if(options && options.withLink && options.withLink == 1) {
                out += "</a>\n";
            }
        }
        return out;
    }
}
class UpcomingBlock {
    eventHandler(e){
        console.log(e.detail);
        var data = e.detail;
        if(data.type == "MatchLiveEvent"){
            var mid = data.matchid;
            for(var i=0; i < this.matches.length; i++){
                if(this.matches[i].model.id == mid){
                    this.live_matches.push(this.matches[i]);
                    this.matches.splice(i,1);
                    $(this.target).html(this.render());
                    return;
                }
            }
        }
        else if(data.type == "MatchOverEvent"){
            var mid = data.matchid;
            for(var i=0; i < this.live_matches.length; i++){
                if(this.live_matches[i].model.id == mid){
                    this.live_matches.splice(i,1);
                    $(this.target).html(this.render());
                    return;
                }
            }
            for(var i=0; i < this.matches.length; i++){
                if(this.matches[i].model.id == mid){
                    this.matches.splice(i,1);
                    $(this.target).html(this.render());
                    return;
                }
            }
        }
        else if(data.type == "MatchAddedEvent"){

        }
    }
    constructor(search="",data =[],target=''){
        this.search = search;
        this.match_data = data;
        this.live_match_data = null;
        this.matches = [];
        this.live_matches = [];
        this.url = "/api/Matches/UpcomingMatches";
        this.target = target;

        document.addEventListener('MatchOverEvent',$.proxy(this.eventHandler,this));
        document.addEventListener('MatchAddedEvent',$.proxy(this.eventHandler,this));
        document.addEventListener('MatchLiveEvent',$.proxy(this.eventHandler,this));

        var me = this;
        $(this.target).html("<div class='is-fullwidth has-text-centered'><div class='fa fa-4x fa-spin fa-spinner'></div></div>");
        this.fetchData();
    }
    fetchData(){
        var me = this;
        $.ajax({"url":this.url+"?search="+this.search,"success":function(res){
            var obj = (res);
            var match = obj.response.matches;
            for(var i=0; i < match.length; i++){
                me.matches.push(new MatchBlock(match[i]));
            }

            me.match_data = match;
            me.live_match_data = obj.response.live_matches;
            for(var i=0; i < me.live_match_data.length; i++){
                me.live_matches.push(new MatchBlock(me.live_match_data[i]));
            }
            if(me.target){
                $(me.target).html(me.render());
                $(".match-link[data-match-id]").each(function(i,o){
                    var id = $(o).attr('data-match-id');
                    var matchdata = null;
                    for(var i= 0;i  < me.matches.length; i++){
                        if(id == me.matches[i].model.id)
                            matchdata = me.matches[i].model;
                    }
                    if(matchdata == null) {
                        for (var i = 0; i < me.live_matches.length; i++) {
                            if (id == me.live_matches[i].model.id)
                                matchdata = me.live_matches[i].model;
                        }
                    }
                    if($(o).find(".countdown-timer").length > 0){
                        var counter =$(o).find(".countdown-timer");
                        setInterval($.proxy(me.timertick,me,counter,matchdata.begins_at),1000);
                    }
                    $(o).on('click',$.proxy(me.handlematchclick,me,matchdata.id));
                });
            }
        },"error":function(){
            console.log("Opps error occured on coming block");
        }});
    }
    timertick(counter,time){
        var dt = moment.utc(time).local();
        var now = moment();
        var duration = moment.duration(dt.diff(now));
        var out = "";
        if(now.isBefore(dt)) {
            if (duration.get('days') > 0) {
                out += duration.get("days") + " days";
            }
            else if (duration.get("hours") > 0) {
                out += duration.get("hours") + " h";
            }
            else if (duration.get("minutes") > 0) {
                out += duration.get("minutes") + " m";
            }
            else if (duration.get("seconds") > 0) {
                out += duration.get("seconds") + " s";
            }
            $(counter).html(out);
        }
        else
            $(counter).html(out);
    }
    handlematchclick(data){
        event.stopPropagation();
        event.preventDefault();
        window.vgoapp.loadMatchPage(data);
        //$.proxy(window.vgoapp.loadMatchPage,window.vgoapp,data);
    }
    render() {
        var out = "";
        if(this.live_matches.length > 0) {
            out += '<article class="message is-dark">\n';
            out += '<div class="message-header">\n';
            out += '<p class="content"><h1>Live Matches</h1></p>\n';
            out += '</div>\n';
            out += '<div class="message-body">\n';

            for (var i = 0; i < this.live_matches.length; i++) {
                out += this.live_matches[i].render({withLink: 1, showLeague: 1, matchType: 1});
            }
            out += '</div>';
            out += '</article>';
            out += "<br>";
        }
        out += '<article class="message is-dark">\n';
        out += '<div class="message-header">\n';
        out +='<p class="content"><h1>Upcoming matches</h1></p>\n';
        out += '</div>\n';
        out +='<div class="message-body">\n';
        var pastdate = "";
        for(var i=0; i < this.matches.length; i++){
            var m = moment.utc(this.matches[i].model.begins_at).local();
            if(pastdate != m.format("YYYY MM")) {
                out += "<br><h3 class='content'>"+m.format("YYYY MM")+"</h3>\n<br>";
                pastdate = m.format('YYYY MM');
            }
            out += this.matches[i].render({withLink:1,showLeague:1,matchType:1});
        }
        out +='</div>';
        out +='</article>';
        return out;
    }
}

class PastBlock {
    constructor(search="",data =[],target=''){
        this.search = search;
        this.target = target;
        this.match_data = data;
        this.matches = [];
        this.current_page = 1;
        this.totalpages = 0;
        this.url = "/api/Matches/PastMatches";
        var me = this;
        $(this.target).html("<div class='is-fullwidth has-text-centered'><div class='fa fa-4x fa-spin fa-spinner'></div></div>");

        $.ajax({"url":this.url+"?search="+this.search,"success":function(res){
            var obj = (res);
            var match = obj.response.matches;
            for(var i=0; i < match.length; i++){
                me.matches.push(new MatchBlock(match[i]));
            }
            me.match_data = match;
            me.totalpages = obj.response.total_pages;
            $(me.target).html(me.render());
            $(".match-link[data-match-id]").each(function(i,o){
                var id = $(o).attr('data-match-id');
                var matchdata = null;
                for(var i= 0;i  < me.matches.length; i++){
                    if(id == me.matches[i].model.id)
                        matchdata = me.matches[i].model;
                }
                $(o).on('click',$.proxy(me.handlematchclick,me,matchdata.id));
            });
            $("#next_button").on('click',$.proxy(me.renderNextPage,me));
        },"error":function(){
            console.log("Opps error occured on coming block");
        }});
    }
    handlematchclick(data){
        event.stopPropagation();
        event.preventDefault();
        window.vgoapp.loadMatchPage(data);
        //$.proxy(window.vgoapp.loadMatchPage,window.vgoapp,data);
    }
    renderNextPage(event){
        event.preventDefault();
        this.current_page++;
        var me = this;
        var out ="";
        $("#next_button").html("<div class='fa fa-spin fa-spinner'></div>");
        //$("#past_block  > .message-body").append("<div class='is-fullwidth has-text-centered'><div class='fa fa-4x fa-spin fa-spinner'></div></div>");
        $.ajax({"url":this.url+"?search="+this.search+"&page="+this.current_page,"success":function(res){
            var obj = (res);
            var match = obj.response.matches;
            var pastdate = "";
            for(var i=0; i < match.length; i++){
                var ma = new MatchBlock(match[i]);
                me.matches.push(ma);
                me.match_data.push(match[i]);
                var m = moment(ma.model.begins_at);

                if(pastdate != m.format("YYYY MM")) {
                    out += "<br><h3>"+m.format("YYYY MM")+"</h3>\n<br>";
                    pastdate = m.format('YYYY MM');
                }
                out += ma.render();
            }
            if(me.totalpages > 0)
                out += "<div class='has-text-centered'><a href='"+me.url+"?page="+(me.current_page+1)+"' class='button' id='next_button'><div class='fa fa-plus'></div> Get More Results</a></div>";

            $("#next_button").remove();
            $("#past_block  > .message-body").append(out);
            $("#past_block > .message-body > .match-link[data-match-id]").each(function(i,o){
                var id = $(o).attr('data-match-id');
                var matchdata = null;
                for(var i= 0;i  < me.matches.length; i++){
                    if(id == me.matches[i].id)
                        matchdata = me.matches[i];
                }
                $(o).on('click',$.proxy(me.handlematchclick,me,matchdata));
            });
            $("#next_button").on('click',$.proxy(me.renderNextPage,me));
        },"error":function(){
            console.log("Opps error occured on coming block");
        }});
        return false;
    }
    render() {
        var out = "";
        out += '<article class="message is-dark" id="past_block">\n';
        out += '<div class="message-header">\n';
        out +='<p><h1>Past matches</h1></p>\n';
        out += '</div>\n';
        out +='<div class="message-body">\n';
        var pastdate = "";
        for(var i=0; i < this.matches.length; i++){
            var m = moment.utc(this.matches[i].model.begins_at).local();
            if(pastdate != m.format("YYYY MM")) {
                out += "<br><h3>"+m.format("YYYY MM")+"</h3>\n<br>";
                pastdate = m.format('YYYY MM');
            }
            out += this.matches[i].render({withLink:1,showLeague:1,matchType:1});
        }
        if(this.totalpages > 0)
            out += "<div class='has-text-centered'><a href='"+this.url+"?page="+(this.current_page+1)+"' class='button' id='next_button'><div class='fa fa-plus'></div> Get More Results</a></div>";

        out +='</div>\n';
        out +='</article>\n';
        return out;
    }
}