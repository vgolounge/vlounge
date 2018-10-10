#!/usr/bin/env node
var WebSocketServer = require('websocket').server;
var http = require('http');
var mysql = require("mysql");

var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(8080, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});
var connid = 0;
wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});
class MysqlMatchData {
    mysql_connect(){
        var mysql_connection = mysql.createConnection({
            host:'localhost',
            user:'homestead',
            'password':'secret',
            'database':'vgo'
        });

        mysql_connection.connect();
        this.mysql_conn = mysql_connection;
    }
    constructor(){
        this.mysql_conn = null;
        this.matchids = {};
        this.match_data = {};
        this.mysql_connect();
        setTimeout(this.fetch_loops.bind(this),0);
    }
    addMatch(mid,obj){
        if(typeof this.matchids[mid]  == "undefined"){
            this.matchids[mid] = {'isquerying':0,objs:[obj],ts:0,'last_score_card':null,'logs':[]};
        }
        else {
            this.matchids[mid].objs.push(obj);
            obj.sendClient(1,1); // force a update on new clients
        }
    }
    removeMatch(mid,obj){
        if(typeof this.matchids[mid]  != "undefined"){
            var dat = this.matchids[mid];
            for(var i= 0; i < dat.objs.length; i++){
                if(dat.objs[i].connid == obj.connid){
                    console.log("Removing "+mid+" obj from query list");
                    this.matchids[mid].objs.splice(i,1);
                    console.log(this.matchids[mid].objs);
                    if(this.matchids[mid].objs.length == 0){
                        delete this.matchids[mid];
                        console.log("Match objs ended removing from query queue");
                    }
                    return;
                }
            }
        }
    }
    fetch_loops(){
        var keys =Object.keys(this.matchids);
        //console.log("In fetch loop");
        for(var i=0; i < keys.length; i++) {
            var qry = "";
            if(!this.matchids[keys[i]].isquerying) {
                if (this.matchids[keys[i]].ts == 0) {
                    qry = "SELECT * from match_data where matchid='" + keys[i] + "' order by `timestamp`;";
                }
                else {
                    qry = "SELECT * from match_data where matchid='" + keys[i] + "' and `timestamp`>'" + this.matchids[keys[i]].ts + "' order by `timestamp`;";
                }
                //console.log(qry);
                this.matchids[keys[i]].isquerying =1 ;
                this.mysql_conn.query(qry, this.handleRes.bind(this, keys[i]));
            }
        }
        setTimeout(this.fetch_loops.bind(this),500);
    }
    handleRes(mid,error,results,fields){
        if(error != null){
            if(error.code == 'PROTOCOL_CONNECTION_LOST')
            {
                this.mysql_connect();
                return;
            }
            throw(error);
        }


        var log_sendupdate = 0;
        var sc_sendupdate = 0;
        var match_data = this.matchids[mid];
        //console.log("results "+results.length);
        for(var i=0; i < results.length; i++){
            if(!this.matchids[mid]){
                break;
            }
            if(results[i].data_header == "log"){
                if(this.matchids[mid].logs.length == 0){
                    this.matchids[mid].logs.push(results[i]);
                    log_sendupdate = 1;
                }
                else {
                    if(results[i].timestamp > this.matchids[mid].logs[this.matchids[mid].logs.length -1].timestamp){
                        this.matchids[mid].logs.push(results[i]);
                        log_sendupdate = 1;
                    }
                }
            }
            else if(results[i].data_header == "scoreboard") {
                if(this.matchids[mid].last_score_card == null){
                    this.matchids[mid].last_score_card = results[i];
                    sc_sendupdate = 1;
                }
                else if(results[i].timestamp > this.matchids[mid].last_score_card.timestamp){
                    this.matchids[mid].last_score_card = results[i];
                    sc_sendupdate = 1;
                }
            }
            if(results[i].timestamp > this.matchids[mid].ts){
                this.matchids[mid].ts = results[i].timestamp;
            }
        }

        if(this.matchids[mid] && (sc_sendupdate || log_sendupdate)){
            for(var i=0; i < this.matchids[mid].objs.length; i++){
                this.matchids[mid].objs[i].sendClient(log_sendupdate,sc_sendupdate);
            }
        }
        if(this.matchids[mid])
            this.matchids[mid].isquerying = 0;
    }
}
var serverobj = new MysqlMatchData();

class WSClient{
    constructor(conn,cid){
        this.conn = conn;
        this.connid=cid;
        this.isfirsttime = 1;
        this.conn.on('message', this.onMessage.bind(this));
        this.conn.on('close', this.socketClose.bind(this));
        this.matchid = 0;
        this.timestamp = 0;
    }
    onMessage(message)
    {
        if (message.type === 'utf8') {
            //console.log('Received Message: ' + message.utf8Data);
            var data = message.utf8Data;
            if(data.indexOf("MATCH_ID") != -1){
                var matches = data.match(/MATCH_ID:(\d+)/);
                this.matchid = matches[1];
                serverobj.addMatch(this.matchid,this);
            }
        }
    }
    socketClose(reasonCode, description){
        serverobj.removeMatch(this.matchid,this);
        console.log((new Date()) + ' Peer ' + this.conn.remoteAddress + ' disconnected.');
    }
    sendClient(log,sc){
        if(this.isfirsttime && (log || sc)){
            //console.log("log length "+serverobj.matchids[this.matchid].logs.length);
            for(var i=0; i < serverobj.matchids[this.matchid].logs.length; i++){
                this.conn.send(JSON.stringify({
                    ts:serverobj.matchids[this.matchid].ts,
                    'type':'log',
                    'data':serverobj.matchids[this.matchid].logs[i].data
                }));
                this.timestamp= serverobj.matchids[this.matchid].logs[i].timestamp;
            }
            if(serverobj.matchids[this.matchid].last_score_card != null) {
                this.conn.send(JSON.stringify({
                    ts: serverobj.matchids[this.matchid].ts,
                    'type': 'scoreboard',
                    'data': serverobj.matchids[this.matchid].last_score_card.data
                }));
                if (this.timestamp < serverobj.matchids[this.matchid].last_score_card.timestamp)
                    this.timestamp = serverobj.matchids[this.matchid].last_score_card.timestamp;
            }
            this.isfirsttime = 0;
        }
        else {
            if(log){
                for(var i=0; i < serverobj.matchids[this.matchid].logs.length; i++){
                    if(this.timestamp < serverobj.matchids[this.matchid].logs[i].timestamp) {
                        this.conn.send(JSON.stringify({
                            ts: serverobj.matchids[this.matchid].ts,
                            'type': 'log',
                            'data': serverobj.matchids[this.matchid].logs[i].data
                        }));
                        this.timestamp = serverobj.matchids[this.matchid].logs[i].timestamp;
                    }
                }

            }
            if(sc){
                this.conn.send(JSON.stringify({
                    ts:serverobj.matchids[this.matchid].ts,
                    'type':'scoreboard',
                    'data':serverobj.matchids[this.matchid].last_score_card.data
                }));
            }
        }
    }
}
function originIsAllowed(origin) {
    // put logic here to detect whether the specified origin is allowed.
    return true;
}
var conns = [];
wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
        // Make sure we only accept requests from an allowed origin
        request.reject();
        console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
        return;
    }

    var connection = request.accept('echo-protocol', request.origin);
    connid++;
    console.log((new Date()) + ' Connection accepted.');
    conns.push(new WSClient(connection,connid));
});