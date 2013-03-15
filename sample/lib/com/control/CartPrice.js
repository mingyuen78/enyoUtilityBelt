/****************************************************************
     By : Alex Tam aka Ming Yuen
     Website : http://www.isgoodstuff.com
****************************************************************/
enyo.kind({
    name: "com.CartPrice",
    kind: "Control",
    price:0,
    currency:"RM ",  
    components: [
        {
        	name:"totalPrice",
        	content: "RM 0.00"
        }
    ],
    create:function(inSender,inEvent){
    	this.inherited(arguments);
    },
    setCurrency:function(currency){
    	this.currency = currency;
    },
    setPrice:function(value){
    	this.price = parseFloat(value);
        this.$.totalPrice.setContent(this.currency+this.formatCurrency(value));
    },
    addPrice:function(increment){
        this.price = (parseFloat(this.price) + parseFloat(increment));
        this.$.totalPrice.setContent(this.currency+this.formatCurrency(this.price));
    },
    decreasePrice:function(increment){
         this.price = (parseFloat(this.price) - parseFloat(increment));
        this.$.totalPrice.setContent(this.currency+this.formatCurrency(this.price));
    },
    formatCurrency:function(value){
        value = isNaN(value) || value === '' || value === null ? 0.00 : value;
        return parseFloat(value).toFixed(2);
    },
    reset:function(){
    	this.price = 0;
    	this.$.totalPrice.setContent(this.currency+"0.00");
    }
});