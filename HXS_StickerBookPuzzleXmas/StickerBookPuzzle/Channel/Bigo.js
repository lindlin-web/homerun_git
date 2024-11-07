
function LoadCompleteFun(){
    console.log('LoadCompleteFun');
    window.BGY_MRAID && window.BGY_MRAID.gameReady();
};

function GameFinish(){
    console.log('GameFinish');
    window.BGY_MRAID && window.BGY_MRAID.gameEnd();
};

function ClickDownLoad(){
    console.log('ClickDownLoad');
    window.BGY_MRAID && window.BGY_MRAID.open();
};