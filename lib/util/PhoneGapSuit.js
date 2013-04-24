enyo.kind({
	/****************************************************************
	 By : Alex Tam aka Ming Yuen
	 Website : http://www.isgoodstuff.com
	 Static Library, just use directly like a variable without 
	 instatiating.

	 Usage : 
	 var PG = util.PhoneGapSuit;
	 PG.setDeviceReady(true);

	****************************************************************/
	name: "util.PhoneGapSuit",
	statics: {
		version:"1.0.2",
		title:"Alert",
		latitude:3.139702,
		longitude:101.686921,
		deviceReady:false,
        setDeviceReady: function(status){
			enyo.log('Device is ready, PhoneGap Ready...');
			this.deviceReady = status;
			enyo.Signals.send("onDeviceReady");
			enyo.dispatcher.listen(document, "backbutton");
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
	 				enyo.log('Fall Back Glider into Native Browser GPS');
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
			 					enyo.warn("Device/Browser cannot support, arguments requirement not met or security lock");
			 					onFailCallBack.call(this,"B-GPS Not Ready");
			 				}
		 				} else {
		 					// Did not provide 4th param
		 					enyo.warn("Device/Browser cannot support GPS");
		 					onFailCallBack.call(this,"B-GPS Not Ready");
		 				}
	 				} else {
	 					// If all else Fails
	 					enyo.warn("Device/Browser cannot support GPS");
	 					onFailCallBack.call(this,"B-GPS Not Ready");	
	 				}
	
	 				
	 			}
	 		}catch(e){
 	 			onFailCallBack.call(this,"Device Not Ready");
	 			enyo.error('EXCEPTION : '+e.message);
	 		}
	 	},
	 	getCamera: function(iQuality, onSuccessCallBack, onFailCallBack){
	 		try{	
	 			if (arguments.length > 1) {
	 				if (this.getDeviceReady()){
		 				var onCameraGetSuccess = function(imageData) {
						    onSuccessCallBack.call(this, "data:image/jpeg;base64," + imageData);
						};
						var onCameraGetFail = function(message) {
							//Be aware "Camera cancelled" is still an error needed to be handled.
						    onFailCallBack.call(this, message);
						};
		 				navigator.camera.getPicture(onCameraGetSuccess, onCameraGetFail, { quality: iQuality, destinationType: Camera.DestinationType.DATA_URL}); 
						
					} else {
						onFailCallBack.call(this, "Device Not Ready");
					}
	 			} else {
	 				console.log('Invalid arguments');
	 			}
			}catch(e){
				onFailCallBack.call(this,"Device Camera Not Ready");
	 			console.log('EXCEPTION : '+e.message);
			}
	 	},
		alert: function(message,title){
			try{
				switch(arguments.length){
					case 0:
						enyo.log("alert method : Please send at least one arguments");
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
				enyo.error('EXCEPTION : '+e.message);
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
						enyo.log("dialogPrompt method : Insufficient arguments");	
					break;
				}
			} catch(e) {
				enyo.error('EXCEPTION : '+e.message);
			}
		},
		dialogPromptSwitch : function(message, onConfirmCallBack, title, mode){
			if (mode == "PG"){
				navigator.notification.confirm(message, function(index){
					if( index < 2){
						onConfirmCallBack.call(this,true);	
					} else {
						onConfirmCallBack.call(this,false);
					}
				}, title, 'Ok,Cancel');
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
			enyo.log("App closing");
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

