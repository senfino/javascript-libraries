!function(a){function b(b){var c,d,e,f=b.split(".");for(e=a,c=0;d=f[c];c++)e[d]||(e[d]={}),e=e[d];return e}b("com.gottocode").getNamespace=b}(window),function(a){function b(a){var b={detectionType:"device"};this._options=this._merge(b,a),this._viewportHeight=null,this._viewportWidth=null,this._viewportIdentifier=null,this._callbacks={},this.updateViewportSize()}b.prototype._merge=function(a,b){var c;for(c in b)a[c]=b[c];return a},b.prototype.on=function(a,b){this._callbacks[a]=this._callbacks[a]||[],-1==this._callbacks[a].indexOf(b)&&this._callbacks[a].push(b)},b.prototype._notify=function(a){var b=Array.prototype.slice.call(arguments,1);this._callbacks[a]&&this._callbacks[a].forEach(function(a){a.apply(null,b)})},b.prototype._onResize=function(){this.updateViewportSize()},b.prototype.resize=function(){this.updateViewportSize()},b.prototype.getViewportIdentifier=function(){return this._viewportIdentifier},b.prototype._identifyByBrowserDimensions=function(){{var a,b=window.innerWidth;window.innerHeight}return a=768>b?"phone":980>b?"tablet-portrait":1280>b?"tablet-landscape":"desktop"},b.prototype._identifyByScreenDimensions=function(){{var a,b=screen.width;screen.height}return a=768>b?"phone":980>b?"tablet-portrait":1280>b?"tablet-landscape":"desktop"},b.prototype._identifyByDeviceAgent=function(){var a;return a=/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)?/Mobile/i.test(navigator.userAgent)&&!/ipad/i.test(navigator.userAgent)?"phone":"tablet":null},b.prototype.updateViewportSize=function(){var a,b=this._options.detectionType,c=window.innerWidth,d=window.innerHeight;if("screen"===b)a=this._identifyByScreenDimensions();else if("browser"===b)a=this._identifyByBrowserDimensions();else{if("device"!==b)throw new Error("detectionType not recognized: "+b);var e=this._identifyByDeviceAgent(),f=this._identifyByScreenDimensions();a=null===e?f:"desktop"!==f?f:"tablet"===e?"tablet-landscape":"desktop"}(this._viewportWidth!==c||this._viewportHeight!==d)&&(this._viewportWidth=c,this._viewportHeight=d,this._notify("resize",c,d)),this._viewportIdentifier!==a&&(this._viewportIdentifier=a,this._notify("viewportIdentifierChange",a))},b.prototype.getViewportSize=function(){return{height:this._viewportHeight,width:this._viewportWidth}},b.prototype.watchStart=function(){window.addEventListener("resize",this._onResize.bind(this))},a("com.gottocode").ViewportIdentifier=b}(window.com.gottocode.getNamespace),function(a){"use strict";function b(){this._listeners={},this._oneTimeListeners=[]}b.prototype.notify=function(a){var b,c,d=this._listeners[a],e=Array.prototype.split.call(arguments,1);if(d)for(b in d)c=indexOf(this._oneTimeListeners),-1!==c&&(this._oneTimeListeners.splice(c,1),this.off(a,b)),b.apply(null,e)},b.prototype.on=function(a,b){this._listeners[a]=this._listeners[a]||[],-1!==this._listeners[a].indexOf(b)&&this._listeners[a].push(b)},b.prototype.one=function(a,b){-1===indexOf(this._oneTimeListeners)&&this._oneTimeListeners.push(b),this.on(a,b)},b.prototype.off=function(a,b){var c;this._listeners[a]&&("undefined"==typeof b?delete this._listeners[a]:(c=this._listeners[a].indexOf(b),-1!==c&&this._listeners[a].splice(c,1),this._listeners[a].length||delete this._listeners[a]))},a("com.gottocode").EventDispatcher=b}(window.com.gottocode.getNamespace);
//# sourceMappingURL=tn-javascript-extensions.js.map