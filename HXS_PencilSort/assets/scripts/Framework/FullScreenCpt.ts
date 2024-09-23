import { _decorator, Component, Node, screen, Size, size, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('FullScreenCpt')
export class FullScreenCpt extends Component {

    tsf : UITransform;

    start() {
        this.tsf = this.getComponent(UITransform)
    }

    update(deltaTime: number) {
        let width = screen.windowSize.x;
        let Height = screen.windowSize.y;
        let bl = width / Height;
        if (bl > 16/9){
            let bH = Height / 9 * 16;
            let sc = width / bH;
            sc = sc < 1 ? 1 : sc;
            this.tsf.contentSize = new Size(1280 * sc, 720);
        }
        else
        {
            let bW = width / 16 * 9;
            let sc = Height / bW;
            sc = sc < 1 ? 1 : sc;
            this.tsf.contentSize = new Size(1280, 720 * sc);
        }
    }
}


