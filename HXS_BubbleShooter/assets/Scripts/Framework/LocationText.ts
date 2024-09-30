import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LocationText')
export class LocationText extends Component {
    
    @property
    enText = "";

    @property
    enSize = -1;

    @property
    jpText = "";

    @property
    JaSize = -1;

    @property
    krText = "";

    @property
    KrSize = -1;

    @property
    cnText = "";

    @property
    CNSize = -1;

    @property
    DEText = "";

    @property
    DESize = -1;

    @property
    FRText = "";

    @property
    FRSize = -1;

    @property
    ESText = "";

    @property
    ESSize = -1;

    @property
    POText = "";

    @property
    POSize = -1;

    @property
    twText = "";

    @property(Label)
    mLabel : Label;
    
    start() {
        this.mLabel = this.getComponent(Label);
        var language = navigator.language;
        console.log("Language : " + language);
    }

    update(deltaTime: number) {
        var language = navigator.language;
        
        if (language.indexOf("zh") == -1 && language.indexOf("ko") == -1 && language.indexOf("ja") == -1 && language.indexOf("de") == -1 && language.indexOf("fr") == -1 && language.indexOf("es") == -1 && language.indexOf("pt") == -1){
            this.mLabel.string = this.enText.replace(/\$/g, "\n");
            if(this.enSize != -1){
                this.mLabel.fontSize = this.enSize;
            }
        }
        else if (language.indexOf("zh-CN") != -1){
            this.mLabel.string = this.cnText.replace(/\$/g, "\n");
            if(this.CNSize != -1){
                this.mLabel.fontSize = this.CNSize;
            }
        }
        else if (language.indexOf("zh-TW") != -1 || language.indexOf("zh-HK") != -1){
            this.mLabel.string = this.twText.replace(/\$/g, "\n");
            if(this.CNSize != -1){
                this.mLabel.fontSize = this.CNSize;
            }
        }
        else if (language.indexOf("ko") != -1){
            this.mLabel.string = this.krText.replace(/\$/g, "\n");
            if(this.KrSize != -1){
                this.mLabel.fontSize = this.KrSize;
            }
        }
        else if (language.indexOf("ja") != -1){
            this.mLabel.string = this.jpText.replace(/\$/g, "\n");
            if(this.JaSize != -1){
                this.mLabel.fontSize = this.JaSize;
            }
        }
        else if (language.indexOf("de") != -1){
            this.mLabel.string = this.DEText.replace(/\$/g, "\n");
            if(this.DESize != -1){
                this.mLabel.fontSize = this.DESize;
            }
        }
        else if (language.indexOf("fr") != -1){
            this.mLabel.string = this.FRText.replace(/\$/g, "\n");
            if(this.FRSize != -1){
                this.mLabel.fontSize = this.FRSize;
            }
        }
        else if (language.indexOf("es") != -1){
            this.mLabel.string = this.ESText.replace(/\$/g, "\n");
            if(this.ESSize != -1){
                this.mLabel.fontSize = this.ESSize;
            }
        }
        else if (language.indexOf("pt") != -1){
            this.mLabel.string = this.POText.replace(/\$/g, "\n");
            if(this.POSize != -1){
                this.mLabel.fontSize = this.POSize;
            }
        }
    }
}


