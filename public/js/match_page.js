class MatchPage {
    eventHandler(e){
        console.log(e.detail);
        var data = e.detail;
        if(data.type == "MatchLiveEvent"){
            var mid = data.matchid;
            $(".match-status").html("LIVE");
        }
        else if(data.type == "MatchOverEvent"){
            var mid = data.matchid;
            $(".match-status").html("MATCH OVER");
        }
        else if(data.type == "MatchPostponedEvent"){
            var mid = data.matchid;
            $(".match-status").html("MATCH POSTPONED");
        }
        else if(data.type == "MatchDeletedEvent"){
            var mid = data.matchid;
            $(".match-status").html("MATCH DELETED");
        }
        else if(data.type == "MatchBetPlacedEvent"){
            var mid = data.matchid;
            this.betting.refresh();
        }
    }
    constructor(id,data,target){
        this.url = "/api/Matches/GetMatchDetails";
        this.id = id;
        this.data = data;
        this.score_board = null;
        this.target = target;
        this.betting = null;
        var final_url = this.url+"?id="+this.id;
        var me = this;
        document.addEventListener('MatchOverEvent',$.proxy(this.eventHandler,this));
        document.addEventListener('MatchAddedEvent',$.proxy(this.eventHandler,this));
        document.addEventListener('MatchPostponedEvent',$.proxy(this.eventHandler,this));
        document.addEventListener('MatchDeletedEvent',$.proxy(this.eventHandler,this));
        document.addEventListener('MatchBetPlacedEvent',$.proxy(this.eventHandler,this));
        $(this.target).html("<div class='is-fullwidth has-text-centered'><div class='fa fa-4x fa-spin fa-spinner'></div></div>");
        $.ajax({"url":final_url,"success":function(res){
            var obj = res.response;
            me.data = obj;
             if(obj != null) {
                 var ret = me.render();
                 $(me.target).html(ret);

                 me.betting = new MatchBetting(id, target);

                 var counter = $(me.target).find(".countdown-timer");
                 if(counter.length > 0){
                     setInterval($.proxy(me.timertick,me,counter,me.data.begins_at),1000);
                 }
                 $("#stream_select").on('change',$.proxy(me.handle_stream_select,me));
                 if(me.data.streams.length > 0)
                    me.handle_stream_select(0);
                 $(me.target).find(".tabs > ul > li").on('click', function () {
                     parent = $(this).parent();
                     $(parent).find(".is-active").removeClass("is-active");

                     target = $(this).attr("data-target");
                     $(this).addClass('is-active');
                     $(".tab-content").removeClass('is-active');
                     $("#" + target).addClass('is-active');
                 });
                 var scard = $(me.target).find("#score_card");
                 if(scard){
                     me.score_card = new ScoreCard(scard,me.data.id);
                 }
             }
             else {
                 $(me.target).html("ERROR NOT FOUND!");
             }
        }});
    }
    getembed_code(url){
        var embed_templates = {
            'twitch': '<iframe ' +
            'src="%%URL%%" ' +
            'height="480" ' +
            'width="640" ' +
            'frameborder="0" ' +
            'scrolling="0" ' +
            'allowfullscreen="yes">' +
            '    </iframe>',
            'youtube':'<iframe width="640" height="480" src="%%URL%%" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>',
            'znipe':'<iframe width="640" height="480" src="%%URL%%" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>'
        };
        if(url.indexOf("youtube.com")!== -1){
            return embed_templates['youtube'].replace("%%URL%%",url);
        }
        else if(url.indexOf("twitch.tv") !== -1){
            return embed_templates['twitch'].replace("%%URL%%",url);
        }
        else if(url.indexOf("znipe") !== -1){
            return embed_templates['znipe'].replace("%%URL%%",url);
        }
    }
    handle_stream_select(val = -1){
        if(val === -1 || typeof val === "object") {
            var target = $(event.currentTarget);
            val = target.val();
        }

        if(val !== -1 && this.data.streams.length > 0){
            var stream_obj = this.data.streams[val];
            var url = stream_obj.url;
            var embedcode = this.getembed_code(url);
            $("#stream_container").html(embedcode);
        }

    }
    timertick(counter,time){
        var dt = moment.utc(time).local();
        var now = moment();
        var duration = moment.duration(dt.diff(now));
        var out = "";
        if(now.isBefore(dt)) {
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
            $(counter).html("<br>Match Starts in<h1 style='font-size:32px;'>"+out+"</h1>");
        }
        else
            $(counter).html(out);
    }
    renderMatchBlock(match){
        var out = "";
        out += "<table border='1' style='table-layout: fixed;' class='table is-fullwidth'><tbody>\n";
        out += "<tr>\n";
            out += "<td style='width:30%'>\n";
            if (match.team1) {
                out += "<table class='team-block table bg-transparent'><tr><td>" + match.team1.name + "</td><Td style='width:65px;' align='right'><img src='" + match.team1.image + "' style='height:40px; width:auto;'></Td></tr></table>";
            }
            out += "</td>";
            out += "<td style='width:10%; text-align:right;'><b style='font-size:22px; color:" + ((!match.draw && match.score[0].id === match.winner) ? "green" : "red") + "'>" + match.score[0]['value'] + "</b></td>";
            out += "<td style='width:5%'><b style='font-size:22px; '>-</b></td>";
            out += "<td style='width:10%; text-align:left;'><b style='font-size:22px; color:" + ((!match.draw && match.score[1].id === match.winner) ? "green" : "red") + "'>" + match.score[1]['value'] + "</b></td>";
            out += "<td style='width:30%'>";
            if (match.team2) {
                out += "<table class='team-block table bg-transparent'><tr><Td style='width:65px;' align='left'><img src='" + match.team2.image + "' style='height:40px; width:auto;'></Td><td>" + match.team2.name + "</td></tr></table>";
            }
            out += "</td>";
            out += "</tr></tbody></table>";
            return out;
    }
    render(){
        var out = "";
        out += "<div class='is-fullwidth has-text-centered title'><p><h1>"+this.data['league']['name']+"</h1> - <h2>"+this.data['tournament']['name']+"</h2></p></div>";
        out += "<div class='columns'>" +

            "<div class='column'>" +
                '<div class="card card-team">'+
                    '<div class="card-image">'+
                        '<figure class="image is-square">'+
                            '<img src="'+this.data['team1']['image']+'" alt="'+this.data['team1']['name']+'">'+
                        '</figure>'+
                    '</div>'+
                    '<div class="card-content">'+
                        '<div class="media is-marginless">'+
                            '<div class="media-content has-text-centered">'+
                                '<p class="title is-4">'+this.data['team1']['name']+'</p>'+
                            '</div>'+
                        '</div>'+
                        '<div class="content is-fullwidth has-text-centered is-marginless">';
        for(var i=0; i < this.data['score'].length; i++){
            if(this.data['score'][i]['id'] === this.data['team1']['id']){
                if(this.data['winner'] === this.data['score'][i]['id']){
                    out += "<span class='winner' style='font-size:42px;'>";
                }
                else
                    out += "<span class='loser' style='font-size:42px;'>";

                out += this.data['score'][i]['value']+"</span>";
            }
        }
        out += ''+
                        '</div>'+
	                    '<div class="content is-fullwidth is-size-7">'+
	                    '<div>Coins Bet<div class="is-pulled-right has-text-weight-bold team-bet-credits"></div></div>'+
	                    '<div>Your Coins Bet<div class="is-pulled-right has-text-weight-bold team-bet-credits-user"></div></div>'+
	                    '<div>Current Odds<div class="is-pulled-right has-text-weight-bold team-bet-odds"></div></div>'+
                        '</div>'+
                    '</div>'+
                    '<footer class="card-footer">'+
                    '</footer>'+
                '</div>'+
            "</div>" +
            "<div class='column has-text-centered is-vertical-center'>"+
            "<div class='column is-fullwidth'>" +
            "<h1 style='font-size:78px'>VS</h1><br>";
            var mbegins = moment(this.data.begins_at);
            var now = moment();
            if(now.isAfter(mbegins)){
                out += "Started at "+this.data.begins_at;
                out+="<h4 class='match-status'>MATCH OVER!</h4>";
            }
            else {
                out += "Starts at "+this.data.begins_at;
                var duration = moment.duration(now.diff(mbegins));
                out += "<h3 class='countdown-timer'></h3>";
                out+="<h4 class='match-status'>UPCOMING</h4>";
            }

            out +="</div>" +
                "</div>"+
            "<div class='column'>" +
                '<div class="card card-team">'+
                    '<div class="card-image">'+
                        '<figure class="image is-square">'+
                            '<img src="'+this.data['team2']['image']+'" alt="'+this.data['team2']['name']+'">'+
                        '</figure>'+
                    '</div>'+
                    '<div class="card-content">'+
                        '<div class="media is-marginless">'+
                            '<div class="media-content has-text-centered">'+
                                '<p class="title is-4">'+this.data['team2']['name']+'</p>'+
                            '</div>'+
                        '</div>'+
                        '<div class="content has-text-centered is-marginless">';
            for(var i=0; i < this.data['score'].length; i++){
                if(this.data['score'][i]['id'] === this.data['team2']['id']){
                    if(this.data['winner'] === this.data['score'][i]['id']){
                        out += "<span class='winner' style='font-size:42px;'>";
                    }
                    else
                        out += "<span class='loser' style='font-size:42px;'>";

                    out += this.data['score'][i]['value']+"</span>";
                }
            }

            out += ''+
                        '</div>'+
	                    '<div class="content is-fullwidth is-size-7">'+
	                    '<div>Coins Bet<div class="is-pulled-right has-text-weight-bold team-bet-credits"></div></div>'+
	                    '<div>Your Coins Bet<div class="is-pulled-right has-text-weight-bold team-bet-credits-user"></div></div>'+
	                    '<div>Current Odds<div class="is-pulled-right has-text-weight-bold team-bet-odds"></div></div>'+
                        '</div>'+
                    '</div>'+
                    '<footer class="card-footer">'+
                    '</footer>'+
                '</div>'+
            "</div>" +
            "</div>";
            out += "<div class='columns'><div class='column is-fullwidth'><div class='card'>"+
                        "<div class='card-header'><h2 class='card-header-title has-text-centered'>Map List</h2></div>" +
                "<div class='card-content'>" +
                "<div class='columns'>";
            for(var i=0; i < this.data['games'].length; i++){
                var game = this.data['games'][i];
                out += "<div class='column is-4'>" +
                "<div class='card'>" +
                    "<div class='card-content has-text-centered'>"+game['map_name']+"</div>";
                var matchsummary = "";
                if(game['team1']['winner'])
                    matchsummary = "<span class='winner' style='font-size:20px'>";
                else
                    matchsummary = "<span class='loser' style='font-size:20px'>";
                matchsummary += game['team1']['score'];
                matchsummary += "</span>:";

                if(game['team2']['winner'])
                    matchsummary += "<span class='winner' style='font-size:20px'>";
                else
                    matchsummary += "<span class='loser' style='font-size:20px'>";
                matchsummary += game['team2']['score'];
                matchsummary += "</span>";
                out+= "" +
                    "<div class='card-footer has-text-centered'><span class='is-fullwidth has-text-centered' style='width:100%'>"+matchsummary+"</span></div>"+
                    "</div>" +
                "</div>";
            }
            out += "</div>"+
                "</div>" +
                "</div></div></div>";
            out += "<div class='columns'><div class='column is-fullwidth'><div class='card'>"+
                    "<div class='card-header'><h2 class='card-header-title'>Other Bets</h2></div>"+
                    "<div class='card-content'>" +
                        "<div id='other-bets-holder'></div>" +

                "</div>"+
                    "</div></div></div>";
            out += "<div class='columns'><div class='column is-fullwidth'><div class='card'>"+
                        "<div class='card-header'><h2 class='card-header-title'>Match Details</h2></div>"+
                        "<div class='card-content'>" +
                            '<div class="tabs is-centered is-boxed">'+
                                '<ul>'+
                                    '<li class="is-active" id="match_stream_link" data-target="match_stream_page"><a>Stream</a></li>'+
                                    '<li id="match_score_card" data-target="match_score_page"><a>Score Card</a></li>'+
                                '</ul>'+
                            '</div>'+
                            '<div class="is-fullwidth tab-content is-active" id="match_stream_page">' +
                                "<div class='columns'>" +
                                    "<div class='column is-6'><b>Select Stream</b></div>" +
                                    "<div class='column is-6'><select class='select' id='stream_select'>";
                                        if(this.data['streams'].length > 0){
                                            for(var i=0; i < this.data['streams'].length; i++){
                                                out += "<option value='"+i+"'>"+this.data['streams'][i].name+"("+this.data['streams'][i].country+")</option>\n";
                                            }
                                        }
            out += "</select></div>"+
                                "</div>"+
                                "<div class='columns'>" +
                                    "<div class='column is-12 has-text-centered'><div id='stream_container'></div></div>"+
                                "</div>"+
                            '</div>'+
                            '<div class="is-fullwidth tab-content" id="match_score_page">' +
                                "<div id='score_card'></div>"+
                            '</div>'+
                        "</div>"+
                    "</div></div></div>";

            out += "<div class='columns'>" +
                    "<div class='column is-fullwidth content'>" +
                        "<h1 class='has-text-centered is-fullwidth'>Head To Head</h1>" +
                        "<div class='columns'>" +
                            "<div class='column is-fullwidth'>";
                            for(var i=0; i < this.data.h2h.length; i++){
                                //var md = new MatchBlock(this.data.team1_past_matches[i]);
                                out += this.renderMatchBlock(this.data.h2h[i]);
                            }
                            if(this.data.h2h.length === 0){
                                out += "<h1>No matches found!</h1>";
                            }

            out +=          "</div>"+
                        "</div>"+
                    "</div>"+
                "</div>";
        out += "<div class='columns'>" +
                    "<div class='column is-fullwidth content'>" +
                        "<h1 class='has-text-centered is-fullwidth'>Past Match History</h1>" +
                        "<div class='columns'>" +
                            "<div class='column is-6'>";
        out +=                  "<div class='card'>" +
                                    "<div class='card-header content has-text-centered content'><h2 style='margin:auto;'>"+this.data['team1']['name']+"</h2></div>"+
                                    "<div class='card-content'>";
                            for(var i=0; i < this.data.team1_past_matches.length; i++){
                                //var md = new MatchBlock(this.data.team1_past_matches[i]);
                                //out += md.render({"summaryOnly":1});
                                out += this.renderMatchBlock(this.data.team1_past_matches[i]);
                            }
                            if(this.data.team1_past_matches.length === 0){
                                out += "<h1>No matches found!</h1>";
                            }
        out +=                      "</div>";
                        out += "</div>"+
                            "</div>";

        out +=              "<div class='column is-6'>";
        out +=                  "<div class='card'>" +
                                    "<div class='card-header has-text-centered content'><h2 style='margin:auto;'>"+this.data['team2']['name']+"</h2></div>"+
                                        "<div class='card-content'>";
                                            for(var i=0; i < this.data.team2_past_matches.length; i++){
                                                //md = new MatchBlock(this.data.team2_past_matches[i]);
                                                //out += md.render({"summaryOnly":1});
                                                out += this.renderMatchBlock(this.data.team2_past_matches[i]);
                                            }
                                            if(this.data.team2_past_matches.length === 0){
                                                out += "<h1>No matches found!</h1>";
                                            }
            out +=                      "</div>";
                        out += "</div>";

        out +=              "</div>"+
                        "</div>"+
                    "</div>"+
                "</div>";



        out += `
            <div class="modal modal-betting">
              <div class="modal-background"></div>
              <div class="modal-content">
                <div class="box">
                
                </div>
              </div>
              <button class="modal-close is-large" aria-label="close"></button>
            </div>`;

            return out;
    }
}

class MatchBetting {

    constructor(id, target){
        this.id = id;
        this.target = target;

        this.modal = $('.modal-betting');

        this.refresh();
    }

    refresh(){
        const self = this;
        $.ajax({
            url: "/api/Matches/GetBettingData",
            dataType: "json",
            data: {
                match_id: this.id,
            }
        })
            .fail(function() {
                alert( "error" );
            })
            .done(function(res) {
                if (res.status === 1)
                {
                    self.bet_definitions = res.response.definitions;
                    self.render();
                }
            });
    }



    render(){
        console.log('render');
        let $target = $(this.target);
        let self = this;

        let def = [];
        $.each(this.bet_definitions, function (key, val)  {
            if(val.type === 1) {
                return def = val;
            }
        });

        const team_cards = $target.find('.card-team');
        team_cards.each(function (index) {
            const team_id = vgoapp.currentPage.data['team' + (index + 1)].id;

            const has_bet_on_this = def.user_bets_count > 0 && def.options[team_id].user_bets_count > 0;

            let color_class = '';
            if (has_bet_on_this) {
                //if (def.is_active)
                //    color_class = 'is-info';
                //else {
	            if (!def.is_active) {
                    if (vgoapp.currentPage.data.winner === team_id)
                        color_class = 'is-success';
                    else
                        color_class = 'is-danger';
                }
            }

            $(this).find('.team-bet-credits').html(def.options[team_id].bets_credits || '0');
            $(this).find('.team-bet-credits-user').html(def.options[team_id].user_bets_credits || '0');
            $(this).find('.team-bet-odds').html('x' + (def.odds[team_id] || '1.00'));
            $(this).find('footer').html(`<button class="button is-primary is-paddingless is-radiusless button-betting ${color_class} card-footer-item" style="border:none;" ${def.is_active ? '' : 'disabled'} data-defid="${def.id}" data-pickid="${team_id}">${def.is_active ? 'Bet' : ''}</button>`);
        });

        const other_bets_holder = $('#other-bets-holder');
        other_bets_holder.html('');
        $.each(this.bet_definitions, function (key, def) {
            if(def.type !== 1)
            {
            	const has_bet_on = def.user_bets_count;

            	let card = '';
                card += `<div class="card card-team-other">`;
                card += `<div class="card-header other-bets-header clickable" data-defid="${def.id}">`;
                card += `<div class="card-header-title is-block"><div class="is-block">${def.desc}</div><div class="is-size-7 has-text-weight-normal is-block"><span class="other-bets-countdown" id="other_bets_countdown_${def.id}" data-counto="${def.closes_at}">Locks in ...</span></div></div>`;
                if(has_bet_on) {
                	card += `<div class="card-header-title has-text-right is-size-7" style="flex-grow:0;">Your credits bet: ${def.user_bets_credits}</div>`;
                }
                card += `<a class="card-header-icon" aria-label="more options"><span class="icon"><i class="fas fa-angle-down" aria-hidden="true"></i></span></a>`;
                card += `</div>`;
                card += `<div class="card-content other-bets-options" id="bet_options_${def.id}">`;

                $.each(def.options, function (key, opt) {
                	const has_bet_on_this = opt.user_bets_count;

                	card += `<div class="columns">`;
	                card += `<div class="column is-10">`;
					card += `<p class="is-size-7 has-text-weight-bold">${opt.desc}</p>`;
					card += `<p class="is-size-7">Current odds: x${ def.odds[opt.pick] || '1.00' } &nbsp; Total credits bet: ${ opt.bets_credits || '0' }${ has_bet_on_this ? ' &nbsp; Your credits bet: ' + opt.user_bets_credits + '' : '' }</p>`;
	                card += `</div>`;
	                card += `<div class="column is-2 has-text-right">`;
	                if(def.is_active) {
	                	card += `<button class="button button-betting is-primary" ${def.is_active ? '' : 'disabled'} data-defid="${def.id}" data-pickid="${opt.pick}">Bet</button>`;
	                }
	                card += `</div>`;
	                card += `</div>`;
                });
                card += `</div>`;
                card += `</div>`;

                other_bets_holder.append(card);

                var timer = $(self.target).find("#other_bets_countdown_" + def.id);
                if(timer.length > 0) {
                    console.log('timerlength', timer.length, def.closes_at);
                    setInterval($.proxy(self.timertick,self,timer,def.closes_at),1000);
                }
            }
        });

        $target.find('.other-bets-header').on('click', function (index) {
        	const def_id = $(this).data('defid');
        	const icon = $(this).find('.card-header-icon .icon i');

        	$('#bet_options_' + def_id).slideToggle('slow', function() {
				icon.toggleClass('fa-angle-down').toggleClass('fa-angle-up');
			});
        });

        $target.find('.button-betting').on('click', function (index) {
            const pick_id = $(this).data('pickid');
            const def_id = $(this).data('defid');

            var def = [];
            $.each(self.bet_definitions, function (key, val) {
            	if(val.id === def_id) {
	                return def = val;
	            }
	        });

            if(vgoapp.user) {
                if(def.is_active) {
                    self.modal.find('.box').html(`
                    <p><strong>${def.desc}</strong></p>
                    <p>Place bet on <strong>${def.options[pick_id]['desc']}</strong></p>
                    <div class="columns">
                        <div class="column">
                            Your bet
                            <div class="control has-icons-right">
                                <input class="input" type="number" value="${vgoapp.user.credits >= 10 ? 10 : 0}" id="place-bet-value" min="1" max="${vgoapp.user.credits}" required>
                                <span class="icon is-small is-right">
                                    <i class="fas fa-check" id="place-bet-validation"></i>
                                </span>
                            </div>
                        </div>
                        <div class="column">
                            Your possible winnings
                            <input class="input" type="number" value="${vgoapp.user.credits >= 10 ? parseFloat(10 * (def.odds[pick_id] || 1)).toFixed(0) : 0}" id="place-bet-suggestion" disabled>
                        </div>
                    </div>
                    <button type="button" class="button" id="place-bet-submit">PLACE BET</button>`);
                    self.modal.addClass('is-active');

                    const input = self.modal.find('#place-bet-value');
                    const suggestion = self.modal.find('#place-bet-suggestion');
                    const validation_icon = self.modal.find('#place-bet-validation');
                    const submit = self.modal.find('#place-bet-submit');

                    input.on('input', function ()
                    {
                        //suggest winnings
                        if(input.val())
                            parseFloat(
                                suggestion.val(input.val() * (def.odds[pick_id] || 1.00))
                            ).toFixed(0);
                        else
                            input.val('0');

                        //validation icon
                        if (input[0].checkValidity()) {
                            validation_icon.removeClass('fa-times');
                            validation_icon.addClass('fa-check');
                        }
                        else {
                            validation_icon.removeClass('fa-check');
                            validation_icon.addClass('fa-times');
                        }
                    });

                    submit.on('click', function () {
                        if (input[0].checkValidity()) {
                            self.modal.removeClass('is-active');
                            $.ajax({
                                url: "/api/Bet/PlaceBet",
                                method: 'POST',
                                dataType: "json",
                                data: {
                                    definition: def.id,
                                    amount: input.val(),
                                    pick: pick_id
                                }
                            })
                                .fail(function () {
                                    self.refresh();
                                })
                                .done(function (res) {
                                    if (res.status === 1) {
                                        def.user_bet = res.response.bet;
                                        vgoapp.updateUserCredits(res.response.credits)
                                    }
                                    self.refresh();
                                });
                        }
                    })
                }
            }
            else
            {
                self.modal.find('.box').html(`
                    <a href="/login" class="button">LOGIN</a>`);
                self.modal.addClass('is-active');
            }
        });
    }
    timertick(counter,time){
        var dt = moment.utc(time).local();
        var now = moment();
        var duration = moment.duration(dt.diff(now));
        var out = "";

        if(now.isBefore(dt)) {
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
            $(counter).html('Locks in ' + out);
        }
        else
            $(counter).html('LOCKED');
    }
}