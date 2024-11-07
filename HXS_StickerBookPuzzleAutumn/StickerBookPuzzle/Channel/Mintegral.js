

function gameStart() {
	window.postMessage('gameStart', '/')
}

function gameClose() {
	window.postMessage('gameClose', '/')
}

function LoadCompleteFun(){
    console.log('LoadCompleteFun');
    window.gameReady && window.gameReady();
};

function GameFinish(){
    console.log('GameFinish');
    window.gameEnd && window.gameEnd();
};

function ClickDownLoad(){
    console.log('ClickDownLoad');
    window.install && window.install();
};