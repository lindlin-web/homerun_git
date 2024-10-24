var userAgent = navigator.userAgent || navigator.vendor;
var url = 'https://apps.apple.com/app/seaside-escape-merge-story/id6443755785';
var android = 'https://play.google.com/store/apps/details?id=com.gamedots.seasideescape';
if (/android/i.test(userAgent)) {
	url = android
}


if ('undefined' == typeof mraid) {} else {
	if (mraid.getState() === 'loading') {
		mraid.addEventListener('ready', onSdkReady);
	} else {
		onSdkReady();
	}
};

function viewableChangeHandler(viewable) {
	if (viewable) {
        var GameControl = window['GameControl'];
        if(GameControl){
            GameControl.Resume();
        }
	} else {
        var GameControl = window['GameControl'];
        if(GameControl){
            GameControl.Pause();
        }
	}
};

function onSdkReady() {
	mraid.addEventListener('viewableChange', viewableChangeHandler);
};



function LoadCompleteFun(){
    console.log('LoadCompleteFun');
   
};

function GameFinish(){
    console.log('GameFinish');
};

function ClickDownLoad(){
    console.log('ClickDownLoad URL:'+url);
    if ('undefined' == typeof mraid) {
        window.open(url)
    } else {
        mraid.open(url)
    }
};