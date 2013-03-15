enyo.kind({
	name: "App",
	kind: "FittableRows",
	// Imports statics here for ease of usage.
	phoneGap: util.PhoneGapSuit,
	global: com.Global, 
	classes: "enyo-fit enyo-unselectable appBG inflatePadding",
	components: [
		{
			name:"formLogin",
			components: [
				{   	
					tag:"h1",
					content:"Sample App"
				},
				{
						kind: "onyx.InputDecorator", 
						classes:"setWidthFull resetCorner roundedTop whiteInput",
						style:"height:30px",
						components: [
						{
							kind: "Input",
							id:"txtUsername",
							name:"txtUsername",
							classes:"inputFix setWidthFull",
							style:"height:30px;",
							placeholder: "Username",
							attributes:{
								required:"username"
							}
						}
					]
				},
				{
						kind: "onyx.InputDecorator", 
						classes:"setWidthFull resetCorner roundedBottom whiteInput",
						style:"height:30px;",
						components: [
						{
							kind: "Input",
							id:"txtPassword",
							name:"txtPassword",
							type:"password",
							classes:"inputFix setWidthFull",
							style:"height:30px;",
							placeholder: "Password",
							attributes:{
								required:"password"
							}
						}
					]
				}
			
			]

		},
		{
				fit:true
		},
		{
				kind: "onyx.Button", 
				classes:"setWidthFull resetCorner",
				style:"height:40px",
				ontap:"validateThis",
				components: [
					{
						content:"Submit to Validator"
					}
				]
		}
	],
	
	create: function(inSender,inEvent) {
		this.inherited(arguments);
		//Always start your code below this.inherited.
		var MyObject = [];
		MyObject.name = "Alex";
		MyObject.age = 10;

		//Stores an object to global static
		this.global.setObject("People",MyObject);
		console.log(this.global.getObject("People")); 
 	},
 	validateThis : function(inSender,inEvent){
 		var self = this;
 		var validateUtil = new util.Validator();
 		validateUtil.validate(this.$.formLogin,onSuccessValidate,onFailValidate);
 		function onSuccessValidate(results){
 			console.log(results);
 		}
 		function onFailValidate(results){
 			self.phoneGap.alert("This is PhoneGapSuit's Alert : Validation Failed");
 			alert("Please fill up the fields with valid input to proceed");
			for (var i = 0; i < results.errors.length; i++) {
				results.errors[i].controller.setValue("");
				results.errors[i].controller.setAttribute("placeholder", "");
				results.errors[i].controller.setAttribute("placeholder", results.errors[i].message);		
			};
 		}
 	}
			
});