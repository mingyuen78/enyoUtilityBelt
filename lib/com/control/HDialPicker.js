/************************************************************************************
    By : Alex Tam aka Ming Yuen
    Website : http://www.isgoodstuff.com
    Depends com.HDialPicker
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
            layoutKind: "FittableColumnsLayout",
            style:"height:40px;padding:5px;font-weight:bold",
            components:[
                {
                    tag:"div",
                    components:[
                        {
                            kind:"go.IconButton",
                            name:"btnLeft",
                            icon:"icon-chevron-left",
                            ontap:"handleBtn",
                            style:"height:40px"
                        }
                    ]
                },
                {
                    content:"Set Item...",
                    fit:true,
                    name:"txtItemName",
                    allowHtml:true,
                    classes:"truncate",
                    style:"padding:5px;font-size:1em;line-height:30px;text-align:center" 
                },
                {
                    tag:"div",
                    components:[
                        {
                            kind:"go.IconButton",
                            name:"btnRight",
                            icon:"icon-chevron-right",
                            ontap:"handleBtn",
                            style:"height:40px"
                        }
                    ]
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
            var index = this.index;
            this.setupItem(this.itemArray);
            this.index = index;
            this.changeItem(false);
        }
    },
    setTitle: function(title){
        this.title = title;
        this.$.titleControl.setContent(this.title);
    },
    setupItem:function(itemArray){
        this.itemArray = itemArray;
        this.indexLen  = itemArray.length - 1;
        this.index = 0;
        this.changeItem(false);
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
    setIndex:function(value, fireEvent){
        if ( parseInt(value,10) > this.itemArray.length ){
            enyo.warn("Invalid Index");

            return;
        }

        if (value == this.index) {
            return;
        }

        this.index = value;


        this.changeItem(fireEvent);
    },
    getValue: function() {
        return this.itemArray, this.index, this.itemArray[this.index].value;
    },
    changeItem:function(fireEvent){
        if (fireEvent === undefined) {
            fireEvent = true;
        }

        if (this.itemArray.length === 0) {
            this.$.txtItemName.setContent('<span class="grayOut">---</span>');
        } else {
            try {
                this.$.txtItemName.setContent( this.itemArray[this.index].label );
            }
            catch(e) {
                enyo.error("Error in HDialPicker : " + e.message);
            }
        }

        if (fireEvent) {
            this.bubble('onchange');
        }
    },
    nextItem:function(){
        if (this.index == this.indexLen ){
            return;
        }

        this.index++;
        this.changeItem();
    },
    prevItem:function(){
        if (this.index == 0 ){
            return;
        }

        this.index--;
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