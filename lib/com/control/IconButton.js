/************************************************************************************
    By : Alex Tam aka Ming Yuen
    Website : http://www.isgoodstuff.com
************************************************************************************/ 
enyo.kind({
    name: "com.IconButton",
    kind: "onyx.Button",
    icon:"",
 	components:[
		{
			tag:"div",
			name:"buttonDiv" 
 		}
	],
    create:function(){
        this.inherited(arguments);
        this.$.buttonDiv.addClass( this.icon );
    },
    setIcon:function(className){
        //Just in case might wanna make some dual-function mode.
        this.$.buttonDiv.addClass( this.icon );
    }
});