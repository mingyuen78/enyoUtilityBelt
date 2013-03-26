/****************************************************************
	 By : Alex Tam aka Ming Yuen
	 Website : http://www.isgoodstuff.com
*****************************************************************/ 
enyo.kind({
	name: "com.Global",
	statics: {
			version:"1.0.2",
			globalStack: [],
			globalObject: [],
			globalNav: [],
 			storeLocal:function(key, value){
				console.log("Storing to : " + key);
				console.log("With Payload : " + key);
			    localStorage.setItem(key, JSON.stringify(value));
 			},
			getLocal:function(key){
				var returnObject;
				if ( localStorage.getItem(key) != undefined ){
						returnObject = JSON.parse(localStorage.getItem(key));
				} else {
						returnObject = null;
				}
				return returnObject;
			},
			resetLocal:function(key){
				console.log("Resetting LocalStorage for key: " +key);
				delete localStorage[key];
			},
			flush:function(){
				console.log("WARNING: Flushing all localStorage");
				localStorage.clear();
			},
			setObject:function(key, value){
				this.globalObject.push({key:key,value:value});
				console.log("=== Stored Object ===");
				console.log(this.globalObject);
			},
			getObject:function(key){
				console.log("== Fetching ["+key+"] ===");
				for(var key in this.globalObject){
					var obj = this.globalObject[key];
					return obj;
				}
			},
			reset:function(){
				this.globalObject = [];
			},
			pushStack:function(value){
				this.globalStack.push(value);
			},
			popStack:function(value){
				return this.globalStack.pop();
			},
			setNavData:function(value){
				this.globalNav.push(value);	
			},
			getNavData:function(){
				return this.globalNav.pop();	
			},
			resetNavData:function(){
				this.globalNav = [];
			},
			resetGlobalStack:function(){
				this.globalStack = [];
			},
			resetAll:function(){
				this.reset();
				this.resetNavData();
				this.resetGlobalStack();
			}
	}		
});