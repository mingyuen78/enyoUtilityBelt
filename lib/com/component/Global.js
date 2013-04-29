/****************************************************************
	 By : Alex Tam aka Ming Yuen
	 Website : http://www.isgoodstuff.com
*****************************************************************/ 
enyo.kind({
	name: "com.Global",
	statics: {
		version:"1.0.4",
		globalStack: [],
		globalObject: [],
		globalNav: [],
		storeLocal:function(key, value){
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
			for(key in this.globalObject){
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

		checkMemory:function(){
			return this.globalNav;
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
		},
		toObject : function (arr) {
		  var i;
		  var rv = {};
		  for (i = 0; i < arr.length; ++i)
		    if (arr[i] !== undefined) rv[i] = arr[i];
		  return rv;
		},
		mergeObject:function(object1,object2){
		   var c = {};
		   var key1, key2;
		   for (key1 in object1) {
		      c[key1] = object1[key1];
		   }
		   for (key2 in object2) {
		      c[key2] = object2[key2];
		   }
		   return c;
		}
	}
});