/****************************************************************
 By : Alex Tam aka Ming Yuen
 Website : http://www.isgoodstuff.com
****************************************************************/
enyo.kind({
	name: "util.Validator",
	version:"1.0.9",
	allRelevantControls:[],
	allComponents:[],
	allGroupCheck:[],
	allSPGroupCheck:[],
	requiredResults:[],
	tempPassword: null,
	validate: function( parentNodeName, onSuccess, onError ){
		this.allGroupCheck = [];
		this.allSPGroupCheck = [];
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
 		this.allSPGroupCheck = [];
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
		var i;
		for(i = 0; i < resultArray.length; i++){
			var validator = resultArray[i].mode;
			if (!this.validators[validator] || typeof this.validators[validator] != 'function') {
				validator = 'pattern';
			}

			var result = this.validators[validator](resultArray[i]);
			if (result.error) {
				returnErrorArray.push(result.error);
				errorCount++;
			} else if (result.correct) {
				returnCorrectArray.push(result.correct);
			} else if (result.allGroup) {
				this.allGroupCheck.push(result.allGroup);
			} else if (result.allSPGroup) {
				this.allSPGroupCheck.push(result.allSPGroup);
			}
		} // End For

		if (this.allGroupCheck.length){
			if (this.doXorCheck(this.allGroupCheck,false) != -1){
				var correctKind = {};
				correctKind.controller = this.allGroupCheck[this.doXorCheck(this.allGroupCheck,false)].controller;
				returnCorrectArray.push( correctKind );
			} else {
				var i;
				for(i = 0;i < this.allGroupCheck.length;i++) {
					var errorKind = {};
					errorKind.controller = this.allGroupCheck[i].controller;
					errorKind.type = "xor";
					errorKind.messageid = "xor1";
					errorKind.message = "* Please fill in one of these fields";
					returnErrorArray.push( errorKind );
					errorCount++;
				}
			}
		}
		
		if (this.allSPGroupCheck.length){
			if (this.doXorCheck(this.allSPGroupCheck,true) != -1){
				var correctKind = {};
				correctKind.controller = this.allSPGroupCheck[this.doXorCheck(this.allSPGroupCheck,true)].controller;
				returnCorrectArray.push( correctKind );
			} else {
				var i;
				for(i = 0;i < this.allSPGroupCheck.length;i++) {
					var errorKind = {};
					errorKind.controller = this.allSPGroupCheck[i].controller;
					errorKind.type = "oxor";
					errorKind.messageid = "oxor1";
					errorKind.message = "* Please fill in one of these fields";
					returnErrorArray.push( errorKind );
					errorCount++;
				}
			}
		}

		this.allGroupCheck = [];
		this.allSPGroupCheck =[];
		var resultObject = {};
		resultObject.errors = returnErrorArray;
		resultObject.passes = returnCorrectArray;
		resultObject.errorCount = errorCount; 
		
		return resultObject;		
	},
	validators: {
		email: function(component) {
			var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
			if(reg.test(component.value) == false) {
				var errorKind = {};
				errorKind.controller = component.controller;
				errorKind.type = "email";
				errorKind.messageid = "email1";
				errorKind.message = "* Invalid Email";
				return {error: errorKind};
			} else {
				var correctKind = {};
				correctKind.controller = component.controller;
				return {correct: correctKind};
			}
		},

		integer: function(component) {
			var reg = new RegExp("^[-]?[0-9]+[\.]?[0-9]+$");
			if (reg.test( component.value) == false){
				var errorKind = {}
				errorKind.controller = component.controller;
				errorKind.type = "integer";
				errorKind.messageid = "integer1";
				errorKind.message = "* Must be number";
				return {error: errorKind};
			} else {
			 	var correctKind = {};
				correctKind.controller = component.controller;
				return {correct: correctKind};
			}
		},

		positiveinteger: function(component) {
			var reg = new RegExp("[1-9]+");
			if (reg.test( component.value) == false){
				var errorKind = {};
				errorKind.controller = component.controller;
				errorKind.type = "positiveinteger";
				errorKind.messageid = "positiveinteger1";
				errorKind.message = "* Must be at least one.";
				return {error: errorKind};
			} else {
			 	var correctKind = {};
				correctKind.controller = component.controller;
				return {correct: correctKind};
			}
		},
		currency: function(component) {
			var reg = new RegExp("/^\d+\.\d{2}$/"); 
			if( reg.test( component.value ) == false ){
				var errorKind = {};
				errorKind.controller = component.controller;
				errorKind.type = "currency";
				errorKind.messageid = "currency1";
				errorKind.message = "* Must be a valid currency";
				return {error: errorKind};

				errorCount++;
			} else if ((component.value == "") || (component.value == "0")) {
				var errorKind = {};
				errorKind.controller = component.controller;
				errorKind.type = "currency";
				errorKind.messageid = "currency2";
				errorKind.message = "* Must be 0 or empty";
				return {error: errorKind};

				errorCount++;
			} else {
				var correctKind = {};
				correctKind.controller = component.controller;
				return {correct: correctKind};
			}
		},

		password: function(component) {
			this.tempPassword = component.controller.getValue();
			
			if ((component.value.length < 5 ) && (component.value.length > 0)) {
				var errorKind = {};
				errorKind.controller = component.controller;
				errorKind.type = "password";
				errorKind.messageid = "password2";
				errorKind.message = "* Invalid password - too short";
				return {error: errorKind};

				errorCount++;
			} else if (component.value == ""){
				var errorKind = {};
				errorKind.controller = component.controller;
				errorKind.type = "password";
				errorKind.messageid = "password1";
				errorKind.message = "* Password required";
				return {error: errorKind};

				errorCount++;

			} else {
				var correctKind = {};
				correctKind.controller = component.controller;
				this.tempPassword = component.controller.getValue();
				return {correct: correctKind};
			}
		},

		cpassword: function(component) {
			
			if (component.value != this.tempPassword ){
				if ((this.tempPassword.length > 4)){	
					var errorKind = {};
					errorKind.controller = component.controller;
					errorKind.type = "cpassword";
					errorKind.messageid = "cpassword2";
					errorKind.message = "* Passwords don't match";
					return {error: errorKind};
					errorCount++;
				} else {
					if ( this.tempPassword.length > 0 ) {
						var errorKind = {};
						errorKind.controller = component.controller;
						errorKind.type = "cpassword";
						errorKind.messageid = "cpassword3";
						errorKind.message = "* Password too short";
						return {error: errorKind};
						errorCount++;
					} else {
						var errorKind = {};
						errorKind.controller = component.controller;
						errorKind.type = "cpassword";
						errorKind.messageid = "cpassword1";
						errorKind.message = "* Confirm password required";
						return {error: errorKind};
						errorCount++;
					}
					
				}
			} else {
				if (component.value == ""){
					var errorKind = {};
					errorKind.controller = component.controller;
					errorKind.type = "cpassword";
					errorKind.messageid = "cpassword1";
					errorKind.message = "* Confirm password required";
					return {error: errorKind};
					errorCount++;
				} else {
					var correctKind = {};
					correctKind.controller = component.controller;
					return {correct: correctKind};			
				}
		
			}
		},

		username: function(component) {
			var illegalChars = /\W/; // allow letters, numbers, and underscores
			var result=illegalChars.test(String(component.value));
			if (component.value.length > 4) {
				if (result){
					var errorKind = {};
					errorKind.controller = component.controller;
					errorKind.type = "username";
					errorKind.messageid = "username2";
					errorKind.message = "* Invalid username (Illegal Characters)";
					return {error: errorKind};

					errorCount++;
				} else {
					var correctKind = {};
					correctKind.controller = component.controller;
					return {correct: correctKind};
				}
			} else if (component.value == "") {
				
				var errorKind = {};
				errorKind.controller = component.controller;
				errorKind.type = "username";
				errorKind.messageid = "username1";
				errorKind.message = "* Username required";
				return {error: errorKind};

				errorCount++;	
			} else {
				var errorKind = {};
				errorKind.controller = component.controller;
				errorKind.type = "username";
				errorKind.messageid = "username3";				
				errorKind.message = "* Invalid Username - too short";
				return {error: errorKind};

				errorCount++;
			}
		
		},

		xor: function(component) {
			return {allGroup: component};
		},

		oxor: function(component) {
			return {allSPGroup: component};
		},

		required: function(component) {
			if (component.value == ""){
				var errorKind = {};
				errorKind.controller = component.controller;
				errorKind.type = "required";
				errorKind.messageid = "required";
				if ( errorKind.controller.attributes.placeholder.charAt(0) == "*" ) {
					errorKind.message = errorKind.controller.attributes.placeholder;
				} else {
					errorKind.message = "* "+ errorKind.controller.attributes.placeholder + " required";
				}

				return {error: errorKind};
				errorCount++;
			} else {
				var correctKind = {};
				correctKind.controller = component.controller;
				return {correct: correctKind};
			}
		},
		none: function(component) {
			//sure to pass
			var correctKind = {};
			correctKind.controller = component.controller;
			return {correct: correctKind};
		},

		pattern: function(component) {
				//if ( component.controller.getValue() != ""){
				var patternCheckSplit = component.mode.split(" ");
				if (patternCheckSplit.length < 2){
					enyo.error ("Pattern check requires 2 parameters e.g. pattern [^/]");
					throw new Error("Pattern check requires 2 parameters e.g. pattern [^/]");
				} else {
					var checkPattern = new RegExp(patternCheckSplit[1]);
					if (patternCheckSplit.length == 3){
						//Required Check first. Else is mandatory
						if (component.controller.getValue() == ""){
							var errorKind = {};
							errorKind.controller = component.controller;
							errorKind.type = "required";
							errorKind.messageid = "pattern1";
							if ( errorKind.controller.attributes.placeholder.charAt(0) == "*" ) {
								errorKind.message = errorKind.controller.attributes.placeholder;
							} else {
								errorKind.message = "* "+ errorKind.controller.attributes.placeholder + " required";
							}

							return {error: errorKind};
							errorCount++;
						} else {
							//Some value is there.
							var resultPattern=checkPattern.test(String(component.value));
							if (resultPattern) {
								var correctKind = {};
								correctKind.controller = component.controller;
								return {correct: correctKind};
							} else {
								var errorKind = {};
								errorKind.controller = component.controller;
								errorKind.type = "pattern";
								errorKind.messageid = "pattern2";
								errorKind.message = "* Invalid pattern of input";
								
								return {error: errorKind};
								errorCount++;
							}
 						}
					} else {
						//Less Than 3 param, not mandatory, but will check if pattern is wrong;
						if (component.controller.getValue() != ""){
							var resultPattern=checkPattern.test(String(component.value));
							if (resultPattern) {
								var correctKind = {};
								correctKind.controller = component.controller;
								return {correct: correctKind};
							} else {
								var errorKind = {};
								errorKind.controller = component.controller;
								errorKind.type = "pattern";
								errorKind.messageid = "pattern2";
								errorKind.message = "* Invalid pattern of input";
								
								return {error: errorKind};
								errorCount++;
							}
						}

					}
					
			}
			return {};
		}
	},
	
	doXorCheck:function(allGroupCheck,bMulti){
		var i;
		var xorCheck = 0;
		var whoHasValue = 0;
		for(i = 0;i < allGroupCheck.length;i++){
			if (allGroupCheck[i].controller.getValue() == ""){
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
			if (!bMulti){
				returnedResult = -1;
			} else {
				returnedResult = whoHasValue;
			}
		}
		return returnedResult;
	}
});