/****************************************************************
 By : Alex Tam aka Ming Yuen
 Website : http://www.isgoodstuff.com
****************************************************************/
enyo.kind({
	name: "util.Validator",
	version:"1.0.7",
	allRelevantControls:[],
	allComponents:[],
	allGroupCheck:[],
	requiredResults:[],
	validate: function( parentNodeName, onSuccess, onError ){
		this.allGroupCheck = [];
 		this.allRelevantControls = [];
		this.allComponents = [];
		this.requiredResults = [];
		var i;
		for(i = 0; i < parentNodeName.controls.length; i++){
  			this.allComponents.push(parentNodeName.controls[i]);
 		}
 		this.requiredResults = this.findValidationMode(this.allComponents);
  		enyo.log("Only "+ this.requiredResults.length + " required for validation");
 		enyo.log(this.requiredResults);	
 		var validatedResults = this.validateResults( this.requiredResults );
 		if (validatedResults.errorCount){
 			//There's errors
 			onError.call(this,validatedResults);
 		} else {
 			onSuccess.call(this,validatedResults);
 		}
 		this.allGroupCheck = [];
 		this.allRelevantControls = [];
		this.allComponents = [];
		this.requiredResults = [];
	},
	filterKind : function( control ){
		var retResult;
		if(control.attributes.required != null){
			switch(control.kind.toLowerCase()){
				case "onyx.input":
					retResult = true;
				break;

				case "input":
					retResult = true;
				break;

				case "onyx.textarea":
					retResult = true;
				break;

				case "textarea":
					retResult = true;
				break;

				default:
					retResult = false;
				break;
			}
			
		} else {
			retResult = false;
		}
		return retResult;
	},
	findAllOfAKind : function( controls ){
		var i;
		for(i = 0; i < controls.length; i++){
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
		var i;
		for(i = 0; i < resultArray.length; i++){
			switch(resultArray[i].mode){
				case "email":
					var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
					if(reg.test(resultArray[i].value) == false) {
						var errorKind = {};
						errorKind.controller = resultArray[i].controller;
						errorKind.type = "email";
						errorKind.message = "* Invalid Email";
						returnErrorArray.push( errorKind );

						errorCount++;
					} else {
						var correctKind = {};
						correctKind.controller = resultArray[i].controller;
						returnCorrectArray.push( correctKind );
					}
 				break;

 				case "integer":
 					var reg = new RegExp("^[-]?[0-9]+[\.]?[0-9]+$");
					if (reg.test( resultArray[i].value) == false){
						var errorKind = {}
						errorKind.controller = resultArray[i].controller;
						errorKind.type = "integer";
						errorKind.message = "* Must be number";
						returnErrorArray.push( errorKind );

						errorCount++;
					} else {
					 	var correctKind = {};
						correctKind.controller = resultArray[i].controller;
						returnCorrectArray.push( correctKind );
					}
 				break;

 				case "currency":
 					var reg = new RegExp("/^\d+\.\d{2}$/"); 
					if( reg.test( resultArray[i].value ) == false ){
						var errorKind = {};
						errorKind.controller = resultArray[i].controller;
						errorKind.type = "currency";
						errorKind.message = "* Must be a valid currency";
						returnErrorArray.push( errorKind );

						errorCount++;
					} else if ((resultArray[i].value == "") || (resultArray[i].value == "0")) {
						var errorKind = {};
						errorKind.controller = resultArray[i].controller;
						errorKind.type = "currency";
						errorKind.message = "* Must to be 0 or empty";
						returnErrorArray.push( errorKind );

						errorCount++;
					} else {
						var correctKind = {};
						correctKind.controller = resultArray[i].controller;
						returnCorrectArray.push( correctKind );
					}
 				break;

 				case "password":
 					if ((resultArray[i].value.length < 5 ) && (resultArray[i].value.length > 0)) {
						var errorKind = {};
						errorKind.controller = resultArray[i].controller;
						errorKind.type = "password";
						errorKind.message = "* Invalid password - too short";
						returnErrorArray.push( errorKind );

						errorCount++;
					} else if (resultArray[i].value == ""){
						var errorKind = {};
						errorKind.controller = resultArray[i].controller;
						errorKind.type = "password";
						errorKind.message = "* Password required";
						returnErrorArray.push( errorKind );

						errorCount++;

					} else {
						var correctKind = {};
						correctKind.controller = resultArray[i].controller;
						returnCorrectArray.push( correctKind );
					}
					tempPassword = resultArray[i].value;
 				break;

 				case "cpassword":
 					if (resultArray[i].value != tempPassword ){	
						var errorKind = {};
						errorKind.controller = resultArray[i].controller;
						errorKind.type = "cpassword";
						errorKind.message = "* Password doesn't match";
						returnErrorArray.push( errorKind );

						errorCount++;
					} else {
						var correctKind = {};
						correctKind.controller = resultArray[i].controller;
						returnCorrectArray.push( correctKind );
					}
 				break;

 				case "username":
 					var illegalChars = /\W/; // allow letters, numbers, and underscores
					var result=illegalChars.test(String(resultArray[i].value));
					if (resultArray[i].value.length > 4) {
						if (result){
							var errorKind = {};
							errorKind.controller = resultArray[i].controller;
							errorKind.type = "username";
							errorKind.message = "* Invalid username (Illegal Characters)";
							returnErrorArray.push( errorKind );

							errorCount++;
						} else {
							var correctKind = {};
							correctKind.controller = resultArray[i].controller;
							returnCorrectArray.push( correctKind );
						}
					} else if (resultArray[i].value == "") {
						
						var errorKind = {};
						errorKind.controller = resultArray[i].controller;
						errorKind.type = "username";
						errorKind.message = "* Username required";
						returnErrorArray.push( errorKind );

						errorCount++;	
					} else {
						var errorKind = {};
						errorKind.controller = resultArray[i].controller;
						errorKind.type = "username";
						errorKind.message = "* Invalid Username - too short";
						returnErrorArray.push( errorKind );

						errorCount++;
					}
					
 				break;

 				case "xor":
					this.allGroupCheck.push(resultArray[i]);
 				break;

 				case "required":
 					if (resultArray[i].value == ""){
						var errorKind = {};
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
						var correctKind = {};
						correctKind.controller = resultArray[i].controller;
						returnCorrectArray.push( correctKind );
					}
 				break;

 				default:
 					//New Pattern check
 					if ( resultArray[i].controller.getValue() != ""){
	 					var patternCheckSplit = resultArray[i].mode.split(" ");
	 					if (patternCheckSplit.length < 2){
	 						enyo.log ("Pattern check requires 2 parameters e.g. pattern [^/]");
	 					} else {
		  					var checkPattern = new RegExp(patternCheckSplit[1]);

							var resultPattern=checkPattern.test(String(resultArray[i].value));
							if (resultPattern) {
								var correctKind = {};
								correctKind.controller = resultArray[i].controller;
								returnCorrectArray.push( correctKind );
							} else {
								var errorKind = {};
								errorKind.controller = resultArray[i].controller;
								errorKind.type = "pattern";
								errorKind.message = "* Invalid pattern of input";
								returnErrorArray.push( errorKind );
								errorCount++;
							}
	 					}
	 				}	
 				break;
			}//End Switch
		} // End For
		if (this.doXorCheck() != -1){
			var correctKind = {};
			correctKind.controller = this.allGroupCheck[this.doXorCheck()].controller;
			returnCorrectArray.push( correctKind );
		} else {
			var i;
			for(i = 0;i < this.allGroupCheck.length;i++) {
				var errorKind = {};
				errorKind.controller = this.allGroupCheck[i].controller;
				errorKind.type = "xor";
				errorKind.message = "* Please fill in one of these fields";
				returnErrorArray.push( errorKind );
				errorCount++;
			}
		}
		this.allGroupCheck = [];
		var resultObject = {};
		resultObject.errors = returnErrorArray;
		resultObject.passes = returnCorrectArray;
		resultObject.errorCount = errorCount; 
		
		return resultObject;		
	},
	doXorCheck:function(){
		var i;
		var xorCheck = 0;
		var whoHasValue = 0;
		for(i = 0;i < this.allGroupCheck.length;i++){
			if (this.allGroupCheck[i].controller.getValue() == ""){
				xorCheck++;
				whoHasValue = i;
			}
		}
		var returnedResult;
		if (xorCheck > 1) {
			returnedResult = -1;
		} else if (xorCheck == 1) {
			returnedResult = whoHasValue;
		} else {
			returnedResult = -1;
		}
		return returnedResult;
	}
});