#!/usr/bin/env node
var WebSocketServer = require('websocket').server;
var cookieParser = require('cookie');
var http = require('http');
var php_parser = require('groan');
var fs = require('file-system');
var cookie_path = __dirname+"/../storage/framework/sessions/";
var mysql = require("mysql");

/*
 * This is the event server that is responsible for getting backend connections from the front page ui.
 * the client will connect to this server and subscribe a service.
 * the service will send the subscribes depending on the page.
 */

var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(8081, function() {
    console.log((new Date()) + ' Server is listening on port 8081');
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
    constructor(){
        this.mysql_conn = null;
        this.clients = [];
        this.isquerying = 0;
        this.mysql_connect();
        setTimeout(this.fetch_loops.bind(this),0);
    }
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
    addClients(obj){
        this.clients.push(obj);
    }
    removeClient(obj){
        for(var i=0; i < this.clients.length; i++){
            if(this.clients[i].connid == obj.connid){
                this.clients.splice(i,1);
            }
        }
    }
    fetch_loops(){
        if(!this.isquerying) {
            var qry = "SELECT * from site_events;";
            this.isquerying = 1;
            this.mysql_conn.query(qry,this.handleRes.bind(this));
        }
        setTimeout(this.fetch_loops.bind(this),500);
    }
    handleRes(error,results,fields){
        if(error != null) {
            if(error.code == 'PROTOCOL_CONNECTION_LOST')
            {
                this.mysql_connect();
                return;
            }
            throw(error);
        }

        //console.log("results "+results.length);

        for(var i=0; i < results.length; i++){
            var dt = new Date(results[i].created_at);
            this.sendToClients({"type":results[i].event_type,'id':results[i].event_id,'matchid':results[i].match_id,'userid':results[i].by_user,'timestamp':dt.valueOf()});
            var qry = "DELETE FROM site_events where id='"+results[i].id+"'";
            this.mysql_conn.query(qry);
        }
        this.isquerying = 0;
    }
    sendToClients(obj){
        //console.log("Got",obj);
        for(var i=0; i < this.clients.length; i++){
            //console.log(this.clients[i].subtype);
            for(var c=0; c < this.clients[i].subtype.length; c++){
                //console.log(this.clients[i].subtype);
                if(this.clients[i].subtype[c].type == "pastmatches"){
                    if(obj.type == "MatchOverEvent" || obj.type == "MatchAddedEvent")
                        this.clients[i].sendClient(obj);
                }
                else if(this.clients[i].subtype[c].type == "upcoming"){
                    if(obj.type == "MatchOverEvent" || obj.type == "MatchLiveEvent" || obj.type == "MatchAddedEvent" || obj.type == "MatchStatusChangeEvent")
                        this.clients[i].sendClient(obj);
                }
                else if(this.clients[i].subtype[c].type == "match"){
                    if((obj.type == "BetPlacedEvent" || obj.type == "MatchLiveEvent" || obj.type == "MatchOverEvent" || obj.type == "MatchStatusChangeEvent") && obj.matchid == this.clients[i].subtype[c].id)
                        this.clients[i].sendClient(obj);
                }
                else if(this.clients[i].subtype[c].type == "user"){
                    if(obj.type == "BetPlacedEvent" && obj.userid ==this.clients[i].subtype[c].id ){
                        this.clients[i].sendClient(obj);
                    }
                }
            }
        }
    }
}

var serverobj = new MysqlMatchData();

class WSClient{
    constructor(conn,cid,sessid){
        this.conn = conn;
        this.connid=cid;
        this.session_id = sessid;
        this.session_data = null;
        this.subtype = [];
        this.getSessionData();
        this.conn.on('message', this.onMessage.bind(this));
        this.conn.on('close', this.socketClose.bind(this));
    }
    getSessionData(){
        if(this.session_id != ""){
            //console.log("Reading session data");
            var path = cookie_path+this.session_id;
            if(fs.existsSync(path)) {
                var str = fs.readFileSync(path,'utf8');
                var obj = php_parser(str);
                this.session_data = obj;
            }
        }
    }
    onMessage(message)
    {
        if (message.type === 'utf8') {
            //console.log('Received Message: ' + message.utf8Data);
            var data = message.utf8Data;
            var obj= JSON.parse(data);
            var out = [];
            for(var i=0; i < obj.length; i++) {
                if (obj[i].type == "user" && this.session_data) {
                    if (obj[i].id == this.session_data.user_id) {
                        out.push(obj[i]);
                    }
                }
                else {
                    out.push(obj[i]);
                }
            }
            this.subtype = out;
        }
    }
    socketClose(reasonCode, description){
        serverobj.removeClient(this);
        console.log((new Date()) + ' Peer ' + this.conn.remoteAddress + ' disconnected.');
    }
    sendClient(message){
        this.conn.send(JSON.stringify(message));
    }
}
function originIsAllowed(origin) {
    // put logic here to detect whether the specified origin is allowed.
    return true;
}

wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
        // Make sure we only accept requests from an allowed origin
        request.reject();
        //console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
        return;
    }
    arr =cookieParser.parse(request.httpRequest.headers.cookie);
    //console.log(arr);
    session_id=  "";

    if(arr['vlounge_session'])
        session_id = arr['vlounge_session'];
    var connection = request.accept('echo-protocol', request.origin);
    connid++;
    console.log((new Date()) + ' Connection accepted.');
    serverobj.addClients(new WSClient(connection,connid,session_id));
});
