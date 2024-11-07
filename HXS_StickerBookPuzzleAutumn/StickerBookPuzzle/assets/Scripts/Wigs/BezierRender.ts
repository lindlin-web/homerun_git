import { _decorator, Component, Node, Sprite, Texture2D, UIRenderer } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BezierRender')
export class BezierRender extends UIRenderer {
    @property([Texture2D])
    public textureList:Texture2D[] = [];

    @property({displayName:"每条边上的顶点数量"})
    public pointsCount:number = 10;

    protected _initedMaterial:boolean = false;

    onEnable(): void {
        super.onEnable();
        this.init();
    }

    public init() {
        if(!this._initedMaterial) {
            this.updateMaterial();
        }
        //this.setVertsDirty();
    }

    protected updateMaterial() {
        if(this.textureList.length == 2) {
            this._updateMaterial();
            this._initedMaterial = true;
            return;
        }
    }

    

    protected _updateMaterial() {
        let material = this.getSharedMaterial(0);
        material.setProperty("CC_USE_MODEL", 1);
        if(material) {
            material.setProperty("texture0", this.textureList[0]);
            material.setProperty("texture1", this.textureList[1]);
        }
    }

}


