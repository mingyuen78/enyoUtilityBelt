/****************************************************************
 By : Alex Tam aka Ming Yuen
 Website : http://www.isgoodstuff.com
****************************************************************/
enyo.kind({
	name: "util.Validator",
	version:"1.0.5",
	allRelevantControls:[],
	validate: function( parentNodeName, onSuccess, onError ){
		var allComponents = [];
 		var requiredResults;
		
		var allControls = parentNodeName.controls;
 		for(var i = 0; i < allControls.length; i++){
  			allComponents.push(allControls[i]);
 		}
 		console.log("Validator : There is "+parentNodeName.controls.length + " controls objects detected...");
 		requiredResults = this.findValidationMode(allComponents);
 		console.log("Only "+ requiredResults.length + " required for validation");	
 		var validatedResults = this.validateResults( requiredResults );
 		if (validatedResults.errorCount){
 			//There's errors
 			onError.call(this,validatedResults);
 		} else {
 			onSuccess.call(this,validatedResults);
 		}
 		
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
 					if (resultArray[i].value.length < 6 ){	
						var errorKind = new Object();
						errorKind.controller = resultArray[i].controller;
						errorKind.type = "password";
						errorKind.message = "* Invalid password or too short";
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
					if ((result) || (resultArray[i].value == "")){
						//Positive of illegal Characters
						 
						var errorKind = new Object();
						errorKind.controller = resultArray[i].controller;
						errorKind.type = "username";
						errorKind.message = "* Username A-Z, 0-9 & _ only";
						returnErrorArray.push( errorKind );

						errorCount++;
					} else {
						var correctKind = new Object();
						correctKind.controller = resultArray[i].controller;
						returnCorrectArray.push( correctKind );
					}
 				break;

 				default:
 					if (resultArray[i].value == ""){
						var errorKind = new Object();
						errorKind.controller = resultArray[i].controller;
						errorKind.type = "required";
						errorKind.message = "* "+ errorKind.controller.attributes.placeholder + " required";
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