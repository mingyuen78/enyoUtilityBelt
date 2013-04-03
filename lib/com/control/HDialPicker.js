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
    title:"",
    titleClass:"",    
    buttonClass:"",
    itemArray:[],
    components: [
        {
            tag:"h1",
            name:"titleControl",
            style:"font-size:1em;margin:5px;",
            content:"Set Title...",
            classes:"hidden"
        },
        {
            tag:"div",
            style:"height:40px;text-align:center;padding:5px",
            components:[
                {
                    kind:"go.IconButton",
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
                    style:"margin-top:12px;text-indent:8px;margin-bottom:2px;"
                },
                {
                    kind:"go.IconButton",
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
        if (this.buttonClass != ""){
            this.setButtonClass(this.buttonClass);
        }
        if (this.title == ""){
            this.$.titleControl.addClass("hidden");
        } else {
            this.$.titleControl.setContent(this.title);
            this.$.titleControl.removeClass("hidden");
        }
        if (this.titleClass != ""){
            this.$.titleControl.addClass(this.titleClass);
        }
        if (this.itemArray.length){
            this.setupItem(this.itemArray);
        } 
    },
    setTitle: function(title){
        this.title = title;
        this.$.titleControl.setContent(this.title);
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
    setIndex:function(value){
        if ( parseInt(value,10) > this.itemArray.length ){
            enyo.warn("Invalid Index");
        } else {
            this.index = value;
            this.changeItem();    
        }
        
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
        if (this.indexLen != 0){
            if(inSender.name == "btnRight"){
                this.nextItem();
            } else {
                this.prevItem();
            }
        }
    }
});