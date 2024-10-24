
var userAgent = navigator.userAgent || navigator.vendor;
var url = 'https://apps.apple.com/app/seaside-escape-merge-story/id6443755785';
var android = 'https://play.google.com/store/apps/details?id=com.gamedots.seasideescape';
if (/android/i.test(userAgent)) {
	url = android
}

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
	mraid.addEventListener('stateChange', function() {
		if (mraid.getState() == 'hidden') {
			var GameControl = window['GameControl'];
            if(GameControl){
                GameControl.Pause();
            }
		}
	});

}


function LoadCompleteFun(){
    console.log('LoadCompleteFun');
    if ('undefined' != typeof mraid) {
		if (mraid.getState() === 'loading') {
			mraid.addEventListener('ready', onSdkReady)
		} else {
			onSdkReady()
		}
	}
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