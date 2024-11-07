import { _decorator, Component, Node,IAssembler, RenderData, renderer, UIRenderer } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PageEffectAssemblerBase')
export class PageEffectAssemblerBase extends UIRenderer{

    protected verticesCount = 4;
    protected indicesCount = 6;
    protected floatsPerVert = 5;

    protected colorOffset = 4;

    get verticesFloats() {
        return this.verticesCount * this.floatsPerVert;
    }

    getVfmt() {
        return null;
    }

    updateColor(comp, color) {
        //let uintVerts = this.renderData.vd
    }
}


