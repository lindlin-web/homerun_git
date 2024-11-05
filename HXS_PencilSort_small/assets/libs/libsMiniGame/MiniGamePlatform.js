(function(root){var exports=undefined,module=undefined,require=undefined;var define=undefined;var self=root,window=root,global=root,globalThis=root;(function(){((exports)=>{class MiniGamePlatform{constructor(){this._platform=window["wx"];this._systemInfo=null;}
getPlatform(){if(this._platform){return"wx";}
return null;}
async getSafeAreaSync(){return new Promise((resolve,reject)=>{if(this._systemInfo&&this._systemInfo.safeArea!=null){return resolve(this._systemInfo.safeArea);}
this.getSystemInfoSync().then((info)=>{this._systemInfo=info;let systemstr=info["platform"]+"";if(systemstr.indexOf("ios")<0){let sW=this._systemInfo.screenWidth;let sH=this._systemInfo.screenHeight;this._systemInfo.safeArea={};this._systemInfo.safeArea["left"]=0;this._systemInfo.safeArea["right"]=0;this._systemInfo.safeArea["top"]=0;this._systemInfo.safeArea["bottom"]=0;this._systemInfo.safeArea["width"]=sW;this._systemInfo.safeArea["height"]=sH;let ratio=sH/sW;if(ratio>2){let maxRatio=Math.ceil(1280/720);let testH=sH-sW*maxRatio;let topsVal=testH/2+10;this._systemInfo.safeArea["top"]=topsVal;}}
return resolve(this._systemInfo.safeArea);});});}
async getSystemInfoSync(){return new Promise((resolve,reject)=>{if(this._systemInfo){return resolve(this._systemInfo);}
let info=this._platform.getSystemInfoSync();return resolve(info);});}
async getIsIOSModel(){return new Promise((resolve,reject)=>{this.getSystemInfoSync().then((info)=>{let systemstr=info["platform"]+"";let isIosModel=true;if(!systemstr||systemstr==""){isIosModel=false;}
let isIos=systemstr.indexOf("ios")>=0;if(!isIos){isIosModel=false;}
return resolve(isIosModel);});});}
notifyMiniProgramPlayableStatus(obj){if(!this._platform){return this.showLog("can`t find platform");}
if(!this._platform.notifyMiniProgramPlayableStatus){return;}
console.log("onGameEnd");this._platform.notifyMiniProgramPlayableStatus(obj);}
showLog(message,isAlert){if(isAlert){alert(message);}}}
exports.MiniGamePlatform=MiniGamePlatform;})((window.DDSTL=window.DDSTL||{}));}).call(root);})(function(){if(typeof globalThis!=="undefined")return globalThis;if(typeof self!=="undefined")return self;if(typeof window!=="undefined")return window;if(typeof global!=="undefined")return global;if(typeof this!=="undefined")return this;return{};}.call(this));