class VGOApp {
    closecurrentpage(){
        if(this.currentPage != null){
            if(typeof this.currentPage.close != "undefined"){
                this.currentPage.close();
            }
        }
    }
    eventHandler(){
        this.updateUserCredits();
    }
    constructor(user){
        this.user = user;
        this.currentPage = null;
        this.target = $("#app");
        this.session_id = null;
        this.eventsubs = [];
        this.connection = new WebSocket("ws://thisistest.vlounge.gg:8081",'echo-protocol');
        this.connection.onopen = $.proxy(this.start,this);
        this.connection.onmessage = $.proxy(this.handleMessage,this);
        var url = window.location.href;
        document.addEventListener('BetPlacesEvent',$.proxy(this.eventHandler,this));
        $("#pastmatches_menu").on('click',$.proxy(this.pastMatchesPage,this));
        $("#upcoming_menu").on('click',$.proxy(this.upcomingPage,this));
        $("#account_menu").on('click',$.proxy(this.accountPage,this));
        $("#store_menu").on('click',$.proxy(this.storePage,this));
        this.processURL(url);
        window.onpopstate = $.proxy(this.handlenavigation,this);
    }
    start(){
        if(this.eventsubs.length > 0){
            this.connection.send(JSON.stringify(this.eventsubs));
        }
    }
    handleMessage (e){
        var obj = JSON.parse(e.data);
        var evt = new CustomEvent(obj.type,{"detail":obj});
        document.dispatchEvent(evt);
    }
    sendSubToServer(){
        if(this.connection!= null && this.connection.readyState == 1){
            this.connection.send(JSON.stringify(this.eventsubs));
        }
    }
    changeSubs(data){

        this.eventsubs = [data];
        if(this.user != null){
            this.eventsubs.push({type:"user","id":this.user.id,session:this.session_id});
        }
        this.sendSubToServer();
    }
    handlenavigation(){
        var url = document.location.href;
        this.processURL(url);
    }
    processURL(url){
        if(url.indexOf("/pastmatches") != -1){
            this.pastMatchesPage();
        }
        else if(url.indexOf("/upcoming") != -1){
            this.upcomingPage();
        }
        else if(url.indexOf("/match/") != -1){
            var matches = url.match(/\/match\/(\d+)/);
            if(matches)
                this.loadMatchPage(matches[1]);
            else
                this.loadDefaultPage();
        }
        else if(url.indexOf("/account") != -1){
            this.accountPage();
        }
        else if(url.indexOf("/store") != -1){
            this.storePage();
        }
        else
            this.loadDefaultPage();
    }
    loadDefaultPage(){
        window.history.replaceState("","VGO Home page","/");
        this.closecurrentpage();
        this.currentPage = null;
        this.upcomingPage();
    }
    pastMatchesPage(){
        window.history.pushState("","VGO Home page","/pastmatches");
        this.closecurrentpage();
        this.changeSubs({"type":"pastmatches"});
        this.currentPage = null;
        this.currentPage = new PastBlock("",null,this.target);
    }
    upcomingPage(){
        window.history.pushState("","VGO Home page","/upcoming");
        this.closecurrentpage();
        this.changeSubs({"type":"upcoming"});

        this.currentPage = null;
        this.currentPage = new UpcomingBlock("",null,this.target);
    }
    loadMatchPage(id){
        window.history.pushState("","VGO Home page","/match/"+id);
        this.closecurrentpage();
        this.currentPage = null;
        this.changeSubs({"type":"match","id":id});
        this.currentPage = new MatchPage(id,null,this.target);
    }
    accountPage(){
        window.history.pushState("","VGO Home page","/account");
        this.closecurrentpage();
        this.currentPage = null;
        if(this.user != null)
            this.changeSubs({"type":"account","id":this.user.id});
        this.currentPage = new AccountBlock(this.target);
    }
    storePage(){
        window.history.pushState("","VGO Home page","/store");
        this.closecurrentpage();
        this.currentPage = null;
        if(this.user != null)
            this.changeSubs({"type":"storepage",id:this.user.id});
        this.currentPage = new StoreBlock(this.target);
    }
    updateBalance(){
        var me = this;
        $.ajax({"url":"api/user/GetBalance",success:function(res){
            me.updateUserCredits(res.response.balance);
        }});
    }
    updateUserCredits(credits){
        this.user.credits = credits;
        $('#toolbar-user-credits').text(credits);
    }

    loggedIn(){
    	if(this.user !== null && this.user.id > 0) {
    		return true;
	    } else {
    		return false;
	    }
    }
}
