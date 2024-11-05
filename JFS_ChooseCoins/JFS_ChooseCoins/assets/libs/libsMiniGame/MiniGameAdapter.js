(function(exports){let MINIGAME_PLATFORM={NON:0,WX:1,};class MinGameAdapter{constructor(){this.nPlatform=MINIGAME_PLATFORM.NON;this._platform=new exports.MiniGamePlatform();}
static getInstance(){if(!MinGameAdapter._instance){MinGameAdapter._instance=new MinGameAdapter();}
return MinGameAdapter._instance;}
getPlatform(){switch(this._platform.getPlatform()){case"wx":this.nPlatform=MINIGAME_PLATFORM.WX;break;default:this.nPlatform=MINIGAME_PLATFORM.NON;break;}
return this.nPlatform;}
onGameEnd(){this._platform.notifyMiniProgramPlayableStatus({isEnd:true});}
async getSafeAreaSync(){return this._platform.getSafeAreaSync();}
async getSystemInfoSync(){return this._platform.getSystemInfoSync();}
async getIsIOSModel(){return this._platform.getIsIOSModel();}
showLog(message,isAlert){isAlert=isAlert==null?false:isAlert;this._platform.showLog(message,isAlert);}}
exports.MINIGAME_PLATFORM=MINIGAME_PLATFORM;exports.MinGameAdapter=MinGameAdapter;})((window.DDSTL=window.DDSTL||{}));