/************************************************************************************
    By : Alex Tam aka Ming Yuen
    Website : http://www.isgoodstuff.com
    Depends com.IconButton
************************************************************************************/     
enyo.kind({
    name: "com.HDialPicker",
    kind: "Control",
    index: 0,
    indexLen : 0,
    itemArray:[],
    components: [
        {
        	tag:"div",
         	style:"height:40px;text-align:center;padding:5px",
        	components:[
                {
                    kind:"com.IconButton",
                    name:"btnLeft",
                    ontap:"handleBtn",
                    classes:"setWidth15 floatLeft",
                    icon:"icon-chevron-left",
                    style:"height:40px;"
                },
                {
                    tag:"h4",
                    content:"Set Item...",
                    name:"txtItemName",
                    allowHtml:true,
                    classes:"setWidth70 floatLeft txtAlignCenter truncate",
                    style:"width:70%;margin-top:12px;text-indent:8px;margin-bottom:0px;"
                },
                {
                    kind:"com.IconButton",
                    name:"btnRight",
                    ontap:"handleBtn",
                    classes:"setWidth15 floatRight",
                    icon:"icon-chevron-right",
                    style:"height:40px;"
                }
            ]
        }
    ],
    create:function(inSender,inEvent){
        this.inherited(arguments);
    },
    setupItem:function(itemArray){
        this.itemArray = itemArray;
        this.indexLen  = itemArray.length - 1;
        this.changeItem();
    },
    setButtonClass:function(className){
        this.$.btnLeft.addClass(className);
        this.$.btnRight.addClass(className);
    },
    getSelected:function(){
        return this.itemArray[this.index];
    },
    getIndex:function(){
        return this.index;
    },
    changeItem:function(){
        try {
            this.$.txtItemName.setContent( this.itemArray[this.index].label );
        }
        catch(e) {
            console.log("Error in HDialPicker : " + e.message);
        }
    },
    nextItem:function(){
        this.index++;
        if (this.index > this.indexLen ){
            this.index = this.indexLen;
        } 
        this.changeItem();
    },
    prevItem:function(){
        this.index--;
        if (this.index < 0 ){
            this.index = 0;
        } 
        this.changeItem();
    },
    handleBtn:function(inSender,inEvent){
        if(inSender.name == "btnRight"){
            this.nextItem();
        } else {
            this.prevItem();
        }
    }
});