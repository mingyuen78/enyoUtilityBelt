/************************************************************************************
    By : Alex Tam aka Ming Yuen
    Website : http://www.isgoodstuff.com
    
    Insert a new kind, must use repeater Kind
    {kind:com.ItemImageView}

    this.$.myImgView.setPosition("center");
    this.$.myImgView.setSize("100%","360px");
    this.$.myImgView.setAltStyle(false);
    this.$.myImgView.setSrc("http://enyojs.com/sampler/assets/globe.jpg?="+Math.random());
*************************************************************************************/
enyo.kind({
    name:"com.ItemImageView",
    version:"1.0.3",
    kind:"Control",
    tag:"div",
    classes:"itemImageView",
    style:"text-align:center !important",
    darkMode: true,
    bgPosition: "center",
    position: "center",
    width:"65px",
    height:"65px",
    img:"",
    noSpinner:true,
    components: [
        {
            tag:"div",
            name:"spinnerView",
            classes:"icon-spinner icon-spin small-spinner"
         },
         {
            name: "imagePlaceHolder", 
            kind: "Image",
            classes:"hidden",
            style:"width:0px;height:0px;",
            onload: "imageLoaded", 
            onerror: "imageLoaded"
         }

    ],
    create: function(inSender,inEvent){
        this.inherited( arguments );
        this.setSize(this.width,this.height);
        this.setPosition(this.position); 
        if (this.noSpinner){
            this.$.spinnerView.hide();
        }
        this.setAltStyle(this.darkMode);
        this.useThisGif(this.img);
    },
    setSize: function(width,height){
        this.applyStyle("width",  width);
        this.applyStyle("height", height);
        var myNewHeight = (parseInt(height,10) / 2)-2;
        this.$.spinnerView.applyStyle("margin-top",(myNewHeight + "px"));
    },
    setPosition: function(position){
        switch(position){
            case "left":
                this.position = "left";
                this.newClass = "floatLeft";
            break;

            case "right":
                this.position = "right";
                this.newClass = "floatRight";
            break;

            default:
                this.position = "center";
                this.newClass = "centerDiv";
            break;    
        }
        this.removeClass("centerDiv");
        this.removeClass("right");
        this.removeClass("left");
        this.addClass(this.newClass);
    },
    setBGPosition: function(position){
        this.bgPosition = position;
    },  
    setSrc: function(src){
        this.$.imagePlaceHolder.setSrc(src);
    },

    imageLoaded: function(inSender,inEvent){
        if (inEvent.type == "load"){
            this.$.spinnerView.hide();
            this.applyStyle("background", "url("+ this.$.imagePlaceHolder.src +") no-repeat; background-position:" +this.bgPosition);
        }
    },
    setAltStyle: function(bIsDark){
        this.darkMode = bIsDark;
        if (bIsDark){
            this.$.spinnerView.removeClass("lightMode");
            this.$.spinnerView.addClass("darkMode");
        } else {
            this.$.spinnerView.removeClass("darkMode");
            this.$.spinnerView.addClass("lightMode");
        }
    },
    useThisGif: function(img){
        if(this.img != ""){
            this.$.spinnerView.removeClass("icon-spinner icon-spin small-spinner");
            this.$.spinnerView.createComponent({
                kind:"Image",
                src:img
            });
            this.$.spinnerView.render();
        }
    }
});