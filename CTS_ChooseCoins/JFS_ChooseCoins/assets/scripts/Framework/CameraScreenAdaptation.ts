import { _decorator, Camera, Component, Node, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CameraScreenAdaptation')
export class CameraScreenAdaptation extends Component {
    @property(UITransform)
    RootTra :UITransform;

    @property
    Start = 640;

    @property
    End = 2560;

    @property
    Begin = 45;

    @property
    sc = 1;

    cam : Camera;

    start() {
        this.cam = this.node.getComponent(Camera);
    }

    update(deltaTime: number) {
        let scale = this.Begin + this.sc * (this.RootTra.contentSize.y - this.Start) / (this.End - this.Start)

        this.cam.fov = scale;
    }
}


