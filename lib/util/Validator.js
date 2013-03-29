/****************************************************************
 By : Alex Tam aka Ming Yuen
 Website : http://www.isgoodstuff.com
****************************************************************/
enyo.kind({
	name: "util.Validator",
	version:"1.0.6",
	allRelevantControls:[],
	allComponents:[],
	requiredResults:[],
	validate: function( parentNodeName, onSuccess, onError ){
		this.allComponents = [];
		this.requiredResults = [];
		for(var i = 0; i < parentNodeName.controls.length; i++){
  			this.allComponents.push(parentNodeName.controls[i]);
 		}
 		console.log("Validator : There is "+parentNodeName.controls.length + " controls objects detected...");
 		this.requiredResults = this.findValidationMode(this.allComponents);
 		console.log("Only "+ this.requiredResults.length + " required for validation");	
 		var validatedResults = this.validateResults( this.requiredResults );
 		if (validatedResults.errorCount){
 			//There's errors
 			onError.call(this,validatedResults);
 		} else {
 			onSuccess.call(this,validatedResults);
 		}
 		this.allRelevantControls = [];
		this.allComponents = [];
		this.requiredResults = [];
	},
	filterKind : function( control ){
		if(control.attributes.required != null){
			switch(control.kind.toLowerCase()){
				case "onyx.input":
					return true;
				break;

				case "input":
					return true;
				break;

				case "onyx.textarea":
					return true;
				break;

				case "textarea":
					return true;
				break;

				default:
					return false;
				break;
			}
		} else {
			return false;
		}
	},
	findAllOfAKind : function( controls ){
		for(var i = 0; i < controls.length; i++){
			if (controls[i].controls != null){
				if (controls[i].controls.length == 0){
					if (this.filterKind(controls[i])) {
						this.allRelevantControls.push(
							{
								controller:controls[i],
								mode:controls[i].attributes.required,
								value:controls[i].getValue()
							}
						);
					}
				} else {
					this.findAllOfAKind(controls[i].controls);
				}
			}
		}
	},
	findValidationMode : function( controls ){
		this.allRelevantControls = [];
 		this.findAllOfAKind(controls);
 		return this.allRelevantControls;
 	},
	validateResults : function(resultArray) {
		var returnErrorArray = [];
		var returnCorrectArray = [];
		var errorCount = 0;
		var tempPassword = "";
		for(var i = 0; i < resultArray.length; i++){
			switch(resultArray[i].mode){
				case "email":
					var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
					if(reg.test(resultArray[i].value) == false) {
						var errorKind = new Object();
						errorKind.controller = resultArray[i].controller;
						errorKind.type = "email";
						errorKind.message = "* Invalid Email";
						returnErrorArray.push( errorKind );

						errorCount++;
					} else {
						var correctKind = new Object();
						correctKind.controller = resultArray[i].controller;
						returnCorrectArray.push( correctKind );
					}
 				break;

 				case "integer":
 					var reg = new RegExp("^[-]?[0-9]+[\.]?[0-9]+$");
					if (reg.test( resultArray[i].value) == false){
						var errorKind = new Object();
						errorKind.controller = resultArray[i].controller;
						errorKind.type = "integer";
						errorKind.message = "* Must be number";
						returnErrorArray.push( errorKind );

						errorCount++;
					} else {
					 	var correctKind = new Object();
						correctKind.controller = resultArray[i].controller;
						returnCorrectArray.push( correctKind );
					}
 				break;

 				case "currency":
 					var reg = new RegExp("/^\d+\.\d{2}$/"); 
					if( reg.test( resultArray[i].value ) == false ){
						var errorKind = new Object();
						errorKind.controller = resultArray[i].controller;
						errorKind.type = "currency";
						errorKind.message = "* Must be a valid currency";
						returnErrorArray.push( errorKind );

						errorCount++;
					} else if ((resultArray[i].value == "") || (resultArray[i].value == "0")) {
						var errorKind = new Object();
						errorKind.controller = resultArray[i].controller;
						errorKind.type = "currency";
						errorKind.message = "* Must to be 0 or empty";
						returnErrorArray.push( errorKind );

						errorCount++;
					} else {
						var correctKind = new Object();
						correctKind.controller = resultArray[i].controller;
						returnCorrectArray.push( correctKind );
					}
 				break;

 				case "password":
 					if ((resultArray[i].value.length < 5 ) && (resultArray[i].value.length > 0)) {
						var errorKind = new Object();
						errorKind.controller = resultArray[i].controller;
						errorKind.type = "password";
						errorKind.message = "* Invalid password - too short";
						returnErrorArray.push( errorKind );

						errorCount++;
					} else if (resultArray[i].value == ""){
						var errorKind = new Object();
						errorKind.controller = resultArray[i].controller;
						errorKind.type = "password";
						errorKind.message = "* Password required";
						returnErrorArray.push( errorKind );

						errorCount++;

					} else {
						var correctKind = new Object();
						correctKind.controller = resultArray[i].controller;
						returnCorrectArray.push( correctKind );
					}
					tempPassword = resultArray[i].value;
 				break;

 				case "cpassword":
 					if (resultArray[i].value != tempPassword ){	
						var errorKind = new Object();
						errorKind.controller = resultArray[i].controller;
						errorKind.type = "cpassword";
						errorKind.message = "* Password doesn't match";
						returnErrorArray.push( errorKind );

						errorCount++;
					} else {
						var correctKind = new Object();
						correctKind.controller = resultArray[i].controller;
						returnCorrectArray.push( correctKind );
					}
 				break;

 				case "username":
 					var illegalChars = /\W/; // allow letters, numbers, and underscores
					var result=illegalChars.test(String(resultArray[i].value));
					if (resultArray[i].value.length > 4) {
						if (result){
							var errorKind = new Object();
							errorKind.controller = resultArray[i].controller;
							errorKind.type = "username";
							errorKind.message = "* Invalid username (Illegal Characters)";
							returnErrorArray.push( errorKind );

							errorCount++;
						} else {
							var correctKind = new Object();
							correctKind.controller = resultArray[i].controller;
							returnCorrectArray.push( correctKind );
						}
					} else if (resultArray[i].value == "") {
						
						var errorKind = new Object();
						errorKind.controller = resultArray[i].controller;
						errorKind.type = "username";
						errorKind.message = "* Username required";
						returnErrorArray.push( errorKind );

						errorCount++;	
					} else {
						var errorKind = new Object();
						errorKind.controller = resultArray[i].controller;
						errorKind.type = "username";
						errorKind.message = "* Invalid Username - too short";
						returnErrorArray.push( errorKind );

						errorCount++;
					}
					
 				break;

 				default:
 					if (resultArray[i].value == ""){
						var errorKind = new Object();
						errorKind.controller = resultArray[i].controller;
						errorKind.type = "required";
						if ( errorKind.controller.attributes.placeholder.charAt(0) == "*" ) {
							errorKind.message = errorKind.controller.attributes.placeholder;
						} else {
							errorKind.message = "* "+ errorKind.controller.attributes.placeholder + " required";
						}

						returnErrorArray.push( errorKind );
						errorCount++;
					} else {
						var correctKind = new Object();
						correctKind.controller = resultArray[i].controller;
						returnCorrectArray.push( correctKind );
					}
 				break;
			}//End Switch
		} // End For

		var resultObject = new Object();
		resultObject.errors = returnErrorArray;
		resultObject.passes = returnCorrectArray;
		resultObject.errorCount = errorCount; 
		
		return resultObject;		
	},
});