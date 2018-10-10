
class ScoreCard {
    close(){
        this.connection.close();
    }
    constructor(target,gameid){
        this.connection = null;
        this.target = target;
        this.gameid = gameid;
        this.lastts = +new Date();
        //thisistest.vlounge.gg
        this.connection = new WebSocket("ws://thisistest.vlounge.gg:8080",'echo-protocol');
        this.connection.onopen = $.proxy(this.start,this);
        this.connection.onmessage = $.proxy(this.handleMessage,this);
        $(this.target).html(this.render());
    }
    start(){
        if(this.connection != null){
            this.connection.send("MATCH_ID:"+this.gameid);
        }
    }
    handleMessage(e){
        var obj = JSON.parse(e.data);
        obj.data = JSON.parse(obj.data);
        this.getupdate(obj);
    }
    getupdate(obj){
        if(obj == null)
            return;
        var me =this;
        try {
            if(obj.ts && obj.ts != 0){
                me.lastts = obj.ts;
                var dat = obj;
                if(dat.type == "log"){
                    var l = dat.data.log[0];
                    if(l.PlayerQuit){
                        var pname = l.PlayerQuit.playerName;
                        var side = l.PlayerQuit.playerSide;
                        var color = "";
                        if(side == "TERRORIST")
                            color = "t-color";
                        else
                            color = "ct-color";

                        $("#logs").append("<div><b class='"+color+"'>"+pname+"</b> has left the game!</div>");
                    }
                    if(l.PlayerJoin){
                        var pname = l.PlayerJoin.playerName;
                        $("#logs").append("<div><b>"+pname+"</b> has joined the game!</div>");
                    }
                    if(l.RoundStart){
                        $("#logs").append("<div>Round Start!</div>");
                    }
                    if(l.RoundEnd){
                        $("#logs").append("<div>Round ended with "+l.RoundEnd.winner+" by "+l.RoundEnd.winType+"!</div>");
                        var twin = l.RoundEnd.counterTerroristScore;
                        var ctwin = l.RoundEnd.terroristScore;
                        $("#twins").html(twin);
                        $("#ctwins").html(ctwin);
                    }
                    if(l.Kill){
                        var killer = l.Kill.killerName;
                        var killed = l.Kill.victimName;
                        var kside = l.Kill.killerSide=="CT"?"ct-color":"terrorist-color";
                        var vside = l.Kill.victimSide=="CT"?"ct-color":"terrorist-color";
                        var weapon = l.Kill.weapon;
                        var headshot = l.Kill.headShot?"(headshot)":"";
                        $("#logs").append("<div><b class='"+kside+"'>"+killer+"</b> killed <b class='"+vside+"'>"+killed+"</b> with "+weapon+headshot+"!</div>");
                        if(l.Kill.victimSide == "CT"){
                            $(".ct_player.name").each(function(i,o){
                                if($(o).html() == killed){
                                    $(o).parent().removeClass("dead").addClass("dead");
                                }
                            });
                        }
                        else {
                            $(".t_player.name").each(function(i,o){
                                if($(o).html() == killed){
                                    $(o).parent().removeClass("dead").addClass("dead");
                                }
                            });
                        }
                    }
                }
                else if(dat.type == "scoreboard"){
                    var l = dat.data;
                    var ctteamname = l.ctTeamName;
                    var tteamname = l.tTeamName;
                    var mapname = l.mapName;
                    var currentround = l.currentRound;
                    $("#map_name").html(mapname);
                    $("#roundno").html(currentround);
                    var ctwin = 0;
                    var twin = 0;
                    for(var i=0; i < l.ctMatchHistory.firstHalf.length; i++){
                        if(l.ctMatchHistory.firstHalf[i].type == "lost")
                            twin++;
                        else
                            ctwin++;
                    }
                    for(var i=0; i < l.ctMatchHistory.secondHalf.length; i++){
                        if(l.ctMatchHistory.secondHalf[i].type == "lost")
                            twin++;
                        else
                            ctwin++;
                    }
                    $("#twins").html(twin);
                    $("#ctwins").html(ctwin);
                    var tlist = $(".t_player");
                    var ctlist = $(".ct_player");
                    for(var i=0; i < l.TERRORIST.length; i++){
                        if(!l.TERRORIST[i].alive)
                            $(tlist[i]).removeClass("dead").addClass("dead");
                        else
                            $(tlist[i]).removeClass("dead");

                        $(tlist[i]).children(".name").html(l.TERRORIST[i].name);
                        $(tlist[i]).children(".weapon").html(l.TERRORIST[i].primaryWeapon);
                        $(tlist[i]).children(".health").html(l.TERRORIST[i].hp);
                        $(tlist[i]).children(".money").html(l.TERRORIST[i].money);
                        $(tlist[i]).children(".kills").html(l.TERRORIST[i].score);
                        $(tlist[i]).children(".deaths").html(l.TERRORIST[i].deaths);
                        $(tlist[i]).children(".assist").html(l.TERRORIST[i].assists);
                        $(tlist[i]).children(".armour").html((l.TERRORIST[i].kevlar?"Kevlar,":"")+(l.TERRORIST[i].helmet?"Helmet":""));
                    }
                    for(i=0; i < l.CT.length; i++){
                        if(!l.CT[i].alive)
                            $(ctlist[i]).removeClass("dead").addClass("dead");
                        else
                            $(ctlist[i]).removeClass("dead");

                        $(ctlist[i]).children(".name").html(l.CT[i].name);
                        $(ctlist[i]).children(".weapon").html(l.CT[i].primaryWeapon);
                        $(ctlist[i]).children(".health").html(l.CT[i].hp);
                        $(ctlist[i]).children(".money").html(l.CT[i].money);
                        $(ctlist[i]).children(".kills").html(l.CT[i].score);
                        $(ctlist[i]).children(".deaths").html(l.CT[i].deaths);
                        $(ctlist[i]).children(".assist").html(l.CT[i].assists);
                        $(ctlist[i]).children(".armour").html((l.CT[i].kevlar?"Kevlar,":"")+(l.CT[i].helmet?"Helmet":""));
                    }
                }
            }
        }
        catch(e){
            console.log("something went wrong "+JSON.stringify(obj));
            console.log(e.toString());
            return;
        }
    }
    render(){
        var out ="";
        out += "<table class='table is-fullwidth'>"+
            "<thead>"+
            "<tr>"+
            "<td colspan='8' class='content'>"+
            "<center><h3 class='inline-block' id='map_name'></h3><br>Round <h2 id='roundno'></div>"+
            "<h3 id='twins' class='inline-block t-color'>22</h3><h3 class='inline-block'>:</h3><h3 id='ctwins' class='inline-block ct-color'>22</h3>"+
            "</center>"+
            "</td>"+
            "</tr>"+
            "<tr class='ctheader'>"+
            "<td>Player Name</td>"+
            "<td>Weapon</td>"+
            "<td>Health</td>"+
            "<td>Armour</td>"+
            "<td>Money</td>"+
            "<td>Kills</td>"+
            "<td>Assist</td>"+
            "<td>Deaths</td>"+
            "</tr>"+
            "</thead>"+
            "<tbody>"+
            "<tr class='ct_player'>"+
            "<td class='name'></td>"+
            "<td class='weapon'></td>"+
            "<td class='health'></td>"+
            "<td class='armour'></td>"+
            "<td class='money'></td>"+
            "<td class='kills'></td>"+
            "<td class='assist'></td>"+
            "<td class='deaths'></td>"+
            "</tr>"+
            "<tr class='ct_player'>"+
            "<td class='name'></td>"+
            "<td class='weapon'></td>"+
            "<td class='health'></td>"+
            "<td class='armour'></td>"+
            "<td class='money'></td>"+
            "<td class='kills'></td>"+
            "<td class='assist'></td>"+
            "<td class='deaths'></td>"+
            "</tr>"+
            "<tr class='ct_player'>"+
            "<td class='name'></td>"+
            "<td class='weapon'></td>"+
            "<td class='health'></td>"+
            "<td class='armour'></td>"+
            "<td class='money'></td>"+
            "<td class='kills'></td>"+
            "<td class='assist'></td>"+
            "<td class='deaths'></td>"+
            "</tr>"+
            "<tr class='ct_player'>"+
            "<td class='name'></td>"+
            "<td class='weapon'></td>"+
            "<td class='health'></td>"+
            "<td class='armour'></td>"+
            "<td class='money'></td>"+
            "<td class='kills'></td>"+
            "<td class='assist'></td>"+
            "<td class='deaths'></td>"+
            "</tr>"+
            "<tr class='ct_player'>"+
            "<td class='name'></td>"+
            "<td class='weapon'></td>"+
            "<td class='health'></td>"+
            "<td class='armour'></td>"+
            "<td class='money'></td>"+
            "   <td class='kills'></td>"+
            "   <td class='assist'></td>"+
            "   <td class='deaths'></td>"+
            "   </tr>"+
            "    </tbody>"+
            "    </table>"+
            "    <table class='table is-fullwidth'>"+
            "    <thead>"+
            "   <tr class='theader'>"+
            "    <td>Player Name</td>"+
            "<td>Weapon</td>"+
            "<td>Health</td>"+
            "<td>Armour</td>"+
            "<td>Money</td>"+
            "<td>Kills</td>"+
            "<td>Assist</td>"+
            "<td>Deaths</td>"+
            "</tr>"+
            "</thead>"+
            "<tbody>"+
            "<tr class='t_player'>"+
            "    <td class='name'></td>"+
            "    <td class='weapon'></td>"+
            "   <td class='health'></td>"+
            "  <td class='armour'></td>"+
            "    <td class='money'></td>"+
            "    <td class='kills'></td>"+
            "    <td class='assist'></td>"+
            "    <td class='deaths'></td>"+
            "    </tr>"+
            "    <tr class='t_player'>"+
            "    <td class='name'></td>"+
            "    <td class='weapon'></td>"+
            "    <td class='health'></td>"+
            "    <td class='armour'></td>"+
            "    <td class='money'></td>"+
            "    <td class='kills'></td>"+
            "    <td class='assist'></td>"+
            "    <td class='deaths'></td>"+
            "    </tr>"+
            "    <tr class='t_player'>"+
            "    <td class='name'></td>"+
            "    <td class='weapon'></td>"+
            "    <td class='health'></td>"+
            "    <td class='armour'></td>"+
            "    <td class='money'></td>"+
            "    <td class='kills'></td>"+
            "    <td class='assist'></td>"+
            "    <td class='deaths'></td>"+
            "    </tr>"+
            "    <tr class='t_player'>"+
            "    <td class='name'></td>"+
            "    <td class='weapon'></td>"+
            "    <td class='health'></td>"+
            "    <td class='armour'></td>"+
            "    <td class='money'></td>"+
            "    <td class='kills'></td>"+
            "    <td class='assist'></td>"+
            "    <td class='deaths'></td>"+
            "    </tr>"+
            "    <tr class='t_player'>"+
            "    <td class='name'></td>"+
            "    <td class='weapon'></td>"+
            "    <td class='health'></td>"+
            "    <td class='armour'></td>"+
            "    <td class='money'></td>"+
            "    <td class='kills'></td>"+
            "    <td class='assist'></td>"+
            "    <td class='deaths'></td>"+
            "   </tr>"+
            "</tbody>"+
            "</table>"+
            "<div id='logs' style='width:600px; height:600px; border:1px solid; overflow:auto'></div>";
        return out;
    }
}
