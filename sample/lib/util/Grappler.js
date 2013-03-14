enyo.kind({
	/****************************************************************
	 By : Alex Tam aka Ming Yuen
	 Website : http://www.isgoodstuff.com
	 This is a standard util class for ajax posting and receiving. 
	 Centralized to enable native / web communication like spinner 
	 or centralized error trapping.
	 Dependency : Base64.js loaded first.                                
	****************************************************************/
	name:"util.Grappler",
	version:"1.0.1",
	url:"http://localhost",
	timeout:3000,
	port:80,
	authUsername:"username",
	authPassword:"password",
	offline:"Uh..oh, problem in online connection, check your wifi and internet settings.",
	title:"Alert",
	init : function(sUrl, iPort, iMiliSeconds){
		this.setBaseURL(sUrl);
		this.setPort(iPort);
		this.setTimeOutDelay(iMiliSeconds);
	},
	setAuthKey: function(sUsername, sPassword){
		this.authUsername = sUsername;
		this.authPassword = sPassword;
	},
	create: function(inSender,inEvent){
		this.inherited(arguments);
		//Do stuff onCreate;
	},
	setTitle : function(sTitle){
		this.title = sTitle;
	},
	setBaseURL: function(sUrl){
		this.url = sUrl;
	},
	setPort: function(iPort){
		if (!isNaN(iPort)){
			this.port = iPort;
		} else {
			console.log('Port not integer');
		}
	},
	setTimeOutDelay: function(iMiliSeconds){
		if (!isNaN(iMiliSeconds)){
			this.timeout = iMiliSeconds;
		} else {
			console.log('Timeout not integer');
		}
	},
	setNoNetworkMessage: function(sMessage){
		this.offline = sMessage;
	},
	alertDimissed: function(){
		//Do Nothing.
	},
	checkExtraParam : function(paramObject){
		var returnObject = {};
		if (paramObject != null){
			if(paramObject.method != null){
				returnObject.method = paramObject.method.toUpperCase();
			} else {
				returnObject.method = 'POST';
			}

			if(paramObject.contentType != null){
				if (paramObject.contentType.toLowerCase() == "json"){
					returnObject.contentType = "application/json";
				} else if (paramObject.contentType.toLowerCase() == "form"){
					returnObject.contentType = "application/x-www-form-urlencoded";
				} else {
					returnObject.contentType = paramObject.contentType;	
				}
			} else {
				returnObject.contentType = 'application/json';
			}

			if (paramObject.handleAs != null){
				returnObject.handleAs = paramObject.handleAs;
			} else {
				returnObject.handleAs = "json";
			}

			if (paramObject.headers != null){
				returnObject.headers = paramObject.headers;
			} else {
				returnObject.headers = {};
			}
		} else {
			//use default method
			returnObject.method = 'POST';
			returnObject.handleAs = 'json';
			returnObject.headers = {};
			returnObject.contentType = 'application/json'; 
		}
		console.log(returnObject);
		return returnObject;
	},
	getJSONFile : function(sFileName, onSuccess,onError){
		// 0. Util to get local JSON file. As in physical stored file. (*.json)
		var postMan =  new enyo.Ajax({
			url:sFileName,
			method:'GET',
			handleAs:'json'
		});	
		postMan.go();
		postMan.response(this, onSuccess);
		postMan.error(this, onError);
	},

	gatewayPost: function(sGateway,payLoad,onSuccess,onError,extra ){
		// 1. Used for Old Server connection with sGateway?param="xxxxx". Payload must be in {json}.
		if (navigator.onLine){
			var extraParam = this.checkExtraParam(extra);
			var postMan = new enyo.Ajax({
				url:sGateway,
				method:extraParam.method,
				headers:extraParam.headers,
				timeout:this.timeout,
				handleAs:extraParam.returnAs,
				contentType:extraParam.contentType
			});
			postMan.go(payLoad);
			postMan.response(this, onSuccess);
			postMan.error(this, onError);
 			 
		} else {
			this.failNetwork(); 
		}
	},
	postAuthTo: function(sRouteURL,payLoad,onSuccess,onError,extra){
		// 2. Secure with basic auth web service connection. Payload must be in {json}.
		if (navigator.onLine){
			if(arguments.length > 3){
				var extraParam = this.checkExtraParam(extra);
				this.myToken = this.authUsername + ":" + this.authPassword;
				this.myHash = 'Basic ' + this.encode64(this.myToken);
				this.myAuthString = {"Authorization" : this.myHash};
				var postMan = new enyo.Ajax({
					headers:this.myAuthString,
					timeout:this.timeout,
					url:this.url+":"+this.port+"/"+sRouteURL,
					method:extraParam.method,
					handleAs:extraParam.returnAs,
					contentType:extraParam.contentType
				});
				postMan.go(payLoad);
				postMan.response(this, onSuccess);
				postMan.error(this, onError);
			} else {
				console.log("postAuthTo method: Missing Route URL and required callback names");
			}
		} else {
			this.failNetwork(); 
		}
	},
	postTo: function(sRouteURL,payLoad,onSuccess,onError,extra){
		// 3. Standard web service connection. Payload must be in {json}.
		if (navigator.onLine){
			if(arguments.length > 3){
				//All criteria met
				var extraParam = this.checkExtraParam(extra);
				var postMan = new enyo.Ajax({
					url:this.url+":"+this.port+"/"+sRouteURL,
					method:extraParam.method,
					timeout:this.timeout,
					headers:extraParam.headers,
					handleAs:extraParam.returnAs,
					contentType:extraParam.contentType
				});
				postMan.go(payLoad);
				postMan.response(this, onSuccess);
				postMan.error(this, onError);
			} else {
				console.log("postTo method: Missing Route URL and required callback names");
			}
		} else {
			this.failNetwork(); 
		}
	},
	jsonp: function(sRouteURL,payLoad,onSuccess,onError,extra){
		// 4. JSONP web service connection, uses just full URL including port and slashes. Payload must be {json}
		if (navigator.onLine){
			if(arguments.length > 3){
				//All criteria met
				var extraParam = this.checkExtraParam(extra);
				var postMan = new enyo.JsonpRequest({
					url:sRouteURL,
					timeout:this.timeout,
					callbackName:"callback"
				});
				postMan.go(payLoad);
				postMan.response(this, onSuccess); 
				postMan.error(this, onError);
			} else {
				console.log("postTo method: Missing Route URL and required callback names");
			}
		} else {
			this.failNetwork(); 
		}
	},
	encode64 : function(data){
		return new gears.Base64().encode(data);
	},	
	failNetwork : function(){
	  	if(navigator.notification && navigator.notification.alert){
	        navigator.notification.alert(this.offline, this.alertDimissed, this.title, 'Ok');
	    }else{
	        alert(this.offline);
	    }
	}
});