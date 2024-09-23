import { _decorator, Component, game, Node } from 'cc';
import { MyAudioCpt } from './Audio/MyAudioCpt';
const { ccclass, property } = _decorator;

@ccclass('GameControl')
export class GameControl extends Component {


    public static firstLoading = true;
    protected onLoad(): void {
        window['GameControl'] = this;
        console.log("===========hello world===========GameControl init()=============");
    }

    protected start(): void {
        var LoadCompleteFun = window["LoadCompleteFun"]
        if (LoadCompleteFun != null)
        {
            LoadCompleteFun();
        }
    }

    GetDownloadUrl() : string{
        var userAgent = navigator.userAgent || navigator.vendor;
        var url = 'https://apps.apple.com/us/app/hexa-sort/id6463127238';
        var android = 'https://play.google.com/store/apps/details?id=com.gamebrain.hexasort&hl=en_US&gl=US';
        if (/android/i.test(userAgent)) {
            url = android
        }
        console.log("Url:" + url);
        return url;
    }

    Pause() {
        console.log("Game Pause");
        game.pause();
        GameControl.firstLoading = false;
    }

    Resume(){
        console.log("Game Resume");
        game.resume(); 
        if(GameControl.firstLoading == true)
        {
            GameControl.firstLoading = false;
            game.restart();
        }
    }

    AudioPause(){
        console.log("Game AudioPause");
        MyAudioCpt.mute = true;
    }

    AudioResume(){
        console.log("Game AudioResume");
        MyAudioCpt.mute = false;
    }

    static DownloadClick(){
        console.log("===========hello world===========GameControl GetDownloadUrl()=============DownloadClick");
        var GameFinish = window["GameFinish"]
        if (GameFinish != null)
        {
            console.log("===========hello world===========GameControl GetDownloadUrl()=============11111111111111111111111111111111");
            GameFinish();
        }
        var ClickDownLoad = window["ClickDownLoad"]
        if (ClickDownLoad != null)
        {
                console.log("===========hello world===========GameControl GetDownloadUrl()=============22222222222222222222222222");
                ClickDownLoad();
        }
    }
}


