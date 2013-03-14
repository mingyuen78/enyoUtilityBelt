enyo.kind({
	/****************************************************************
	 By : Alex Tam aka Ming Yuen
	 Website : http://www.isgoodstuff.com
	****************************************************************/
	name: "util.Validator",
	version:"1.0.1",
	validate: function( parentNodeName, onSuccess, onError ){
		var allComponents = [];
		var allControls = parentNodeName.controls;
		for(var i = 0; i < allControls.length; i++){
  			if (allControls[i].components != null){
 				allComponents.push(allControls[i]);
 			}
 		}
 		var requiredResults = this.findValidationMode(allComponents);

 		var validatedResults = this.validateResults( requiredResults );
 		if (validatedResults.errorCount){
 			//There's errors
 			onError.call(this,validatedResults);
 		} else {
 			onSuccess.call(this,validatedResults);
 		}
	},
	findValidationMode : function( components ){
		var allValidatedComponent = [];
		for(var i = 0; i < components.length; i++){
			if( components[i].controls[components[i].controls.length-1].kind != null){
 				var formObject = components[i].controls[components[i].controls.length-1];
				switch(formObject.kind) {
					case "Input":
						if(formObject.attributes.required != null){
							var matchResult = new Object();
							matchResult.controller = formObject; 
							matchResult.mode = formObject.attributes.required;
							matchResult.value = formObject.getValue();
  							allValidatedComponent.push(matchResult);
						}
							
					break;
					case "onyx.Picker":
						//TODO : May add some form of validation to picker and other form widgets
					break;
				}
			}			
 		}
 		return allValidatedComponent;
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