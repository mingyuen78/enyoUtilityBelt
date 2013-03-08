enyo.kind({
	/****************************************************************
	 By : Alex Tam aka Ming Yuen
	 Website : http://www.isgoodstuff.com
	 Static Library, just use directly like a variable without 
	 instatiating.

	 Usage : 
	 var PG = enyo.phonegap.suit;
	 PG.setDeviceReady(true);

	****************************************************************/
	name: "enyo.phonegap.suit",
	statics: {
		version:"1.0.1",
		title:"Alert",
		latitude:3.139702,
		longitude:101.686921,
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
	 	getGPSCoordinate: function(onSuccessCallBack,onFailCallBack,miliSecs,blockFallBack){
	 		try{
	 			if (this.getDeviceReady()){
	 				var onSuccess = function(position){
	 					onSuccessCallBack.call(this,position);
	 				};
	 				var onError = function(error){
	 					onFailCallBack.call(this,error);
	 				};
	 				if (arguments.length > 2){
	 					navigator.geolocation.getCurrentPosition(onSuccess, onError, {timeout:miliSecs});
	 				} else {
	 					navigator.geolocation.getCurrentPosition(onSuccess, onError, {timeout:5000});
	 				}
	 				
	 			} else {
	 				console.log('Fall Back Glider into Native Browser GPS');
	 				//Fall Back Glider into Native Browser GPS
	 				if (navigator.geolocation) {
	 					if (arguments.length > 3) {
		 					if (!blockFallBack){  	
				 				var browserOnSuccess = function(position){
				 					onSuccessCallBack.call(this,position);
				 				};
				 				var browserOnError = function(error){
				 					onFailCallBack.call(this,error);
				 				};
				 				
				 				navigator.geolocation.getCurrentPosition(browserOnSuccess, browserOnError, {timeout:miliSecs});		
			 				} else {
			 					// if it's blocked default error
			 					console.log("Device/Browser cannot support, arguments requirement not met or security lock");
			 					onFailCallBack.call(this,"B-GPS Not Ready");
			 				}
		 				} else {
		 					// Did not provide 4th param
		 					console.log("Device/Browser cannot support GPS");
		 					onFailCallBack.call(this,"B-GPS Not Ready");
		 				}
	 				} else {
	 					// If all else Fails
	 					console.log("Device/Browser cannot support GPS");
	 					onFailCallBack.call(this,"B-GPS Not Ready");	
	 				}
	
	 				
	 			}
	 		}catch(e){
 	 			onFailCallBack.call(this,"Device Not Ready");
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
    }
});
