enyo.kind({
	/****************************************************************
	 By : Alex Tam aka Ming Yuen
	 Website : http://www.isgoodstuff.com
	****************************************************************/
	name: "enyo.phonegap.suit",
	version:"1.0.1",
	title:"Alert",
	latitude:0,
	longitude:0,
	deviceReady:false,
	setDeviceReady: function(status){
		console.log('Device is ready, PhoneGap Ready...');
		this.deviceReady = status;
 	},
 	getDeviceReady: function(){
		return this.deviceReady;
 	},
 	setDefaultAlertTitle: function(title){
 		this.title = title;
 	},
 	setCoordinate: function(latitude,longtitude){
 		this.latitude = latitude;
 		this.longitude = longtitude;
 	},
 	getGPSCoordinate: function(onSuccessCallBack,onFailCallBack){
 		try{
 			if (this.getDeviceReady()){
 				var onSuccess = function(position){
 					onSuccessCallBack.call(this,position);
 				};
 				var onError = function(error){
 					onFailCallBack.call(this,error);
 				};
 				navigator.geolocation.getCurrentPosition(onSuccess, onError, {timeout:10000});
 			}  else {
 				onFailCallBack.call(this,"Device Not Ready");
 				console.log("Device Not Ready");
 			}
 		}catch(e){

 			console.log('EXCEPTION : '+e.message);
 		}
 	},
 	getCamera: function(onSuccessCallBack, onFailCallBack){
 		try{

		}catch(e){

		}
 	},
	alert: function(message,title){
		try{
			switch(arguments.length){
				case 0:
					console.log("alert method : Please send at least one arguments");
				break;

				case 1:
	 				if (navigator.notification){
						navigator.notification.alert(message, this.dialogDismissed, this.title, 'Ok');
	 				} else {
						alert(message);
					}
				break;

				case 2:
					if (navigator.notification){
						navigator.notification.alert(message, this.dialogDismissed, title, 'Ok');
	 				} else {
 						alert(message);
					}
				break;
			}
		} catch(e) {
			console.log('EXCEPTION : '+e.message);
		}
		
	},
	dialogPrompt: function(message,onConfirmCallBack,title){
		try{
			switch(arguments.length){
				case 2:
					if (navigator.notification){
						this.dialogPromptSwitch(message,onConfirmCallBack,this.title,"PG");
					} else {
						this.dialogPromptSwitch(message,onConfirmCallBack,this.title,"WEB");
					}
				break;

				case 3:
					if (navigator.notification){
						this.dialogPromptSwitch(message,onConfirmCallBack,title,"PG");
					} else {
						this.dialogPromptSwitch(message,onConfirmCallBack,title,"WEB");
					}
				break;

				default:
					console.log("dialogPrompt method : Insufficient arguments");	
				break;
			}
		} catch(e) {
			console.log('EXCEPTION : '+e.message);
		}
	},
	dialogPromptSwitch : function(message, onConfirmCallBack, title, mode){
		if (mode == "PG"){
			navigator.notification.confirm(message, onConfirm, title, 'Ok,Cancel');
			var onConfirm = function(index){
				if( index < 2){
					onConfirmCallBack.call(this,true);	
				} else {
					onConfirmCallBack.call(this,false);
				}
			};
		} else {
			var returnValue = confirm(message);
			if (returnValue) {
				onConfirmCallBack.call(this,true);
			} else {
				onConfirmCallBack.call(this,false);
			}
		}
	},
	dialogDismissed: function(event){
		return;
	},
	exitApp: function(message,title){
		if (navigator.app){
			navigator.app.exitApp();
		}
	},
	hideSplashScreen: function(){
		if (navigator.splashscreen){
			navigator.splashscreen.hide();
		}
	}
});