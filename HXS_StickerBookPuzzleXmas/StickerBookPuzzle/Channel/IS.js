
function LoadCompleteFun(){
    console.log('LoadCompleteFun');
    (dapi.isReady()) ? onReadyCallback(): dapi.addEventListener('ready', onReadyCallback);
};

function GameFinish(){
    console.log('GameFinish');
};

function ClickDownLoad(){
    console.log('ClickDownLoad');
    userClickedDownloadButton();
};


function onReadyCallback() {
	dapi.removeEventListener('ready', onReadyCallback);
	let isAudioEnabled = !!dapi.getAudioVolume();
	AudioChangeHandler(isAudioEnabled);
	if (dapi.isViewable()) {
		adVisibleCallback({
			isViewable: true
		})
	}
	dapi.addEventListener('viewableChange', adVisibleCallback);
	dapi.addEventListener('adResized', adResizeCallback);
	dapi.addEventListener('audioVolumeChange', audioVolumeChangeCallback)
};

function adVisibleCallback(event) {
	if (event.isViewable) {
		ss = dapi.getScreenSize();
		viewableChangeHandler(true)
	} else {
		viewableChangeHandler(false)
	}
};

function adResizeCallback(event) {
	screenSize = event
};

function userClickedDownloadButton() {
	dapi.openStoreUrl()
};

function audioVolumeChangeCallback(volume) {
	let isAudioEnabled = !!volume;
	if (isAudioEnabled) {
		AudioChangeHandler(true)
	} else {
		AudioChangeHandler(false)
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

function AudioChangeHandler(viewable) {
	if (viewable) {
        var GameControl = window['GameControl'];
        if(GameControl){
            GameControl.AudioResume();
        }
	} else {
        var GameControl = window['GameControl'];
        if(GameControl){
            GameControl.AudioPause();
        }
	}
}; 