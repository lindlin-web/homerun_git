import { _decorator, AudioSource, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MyAudioCpt')
export class MyAudioCpt extends Component {
    static mute:boolean = true;

    @property
    audioVul = 1;

    as:AudioSource;

    start() {
        this.as = this.getComponent(AudioSource);
        this.as.playOneShot(this.as.clip, 0);
    }

    play() {
        if(!MyAudioCpt.mute) {
            this.as.play();
        }
    }

    setLoop(bo:boolean) {
        this.as.loop = bo;
    }

    update(deltaTime:number) {
        if(MyAudioCpt.mute) {
            this.as.volume = 0;
        } else {
            this.as.volume = this.audioVul;
        }
    }
}


