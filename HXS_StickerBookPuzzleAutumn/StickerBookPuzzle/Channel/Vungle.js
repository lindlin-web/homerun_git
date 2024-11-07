
window.addEventListener('ad-event-pause',
function() {
	var GameControl = window['GameControl'];
    if(GameControl){
        GameControl.Pause();
    }
});
window.addEventListener('ad-event-resume',
function() {
    var GameControl = window['GameControl'];
    if(GameControl){
        GameControl.Resume();
    }
});


function LoadCompleteFun(){
    console.log('LoadCompleteFun');
    
};

function GameFinish(){
    console.log('GameFinish');
    parent.postMessage('complete', '*')
};

function ClickDownLoad(){
    console.log('ClickDownLoad');
    parent.postMessage('download', '*')
};