import { __private, _decorator, CCBoolean, CCFloat, Component, gfx, Node, RenderData, Sprite, Vec2 } from 'cc';
import { rotateAssembler } from './rotateAssembler';
const { ccclass, property } = _decorator;

@ccclass('RotateSprite')
export class RotateSprite extends Sprite {
    

    @property({ type: CCFloat })
    private _rotateSpeed: number = 1;
    @property({ type: Vec2 })
    private _rotateCenter: Vec2 = new Vec2(0.5, 0.5);
    @property({ type: CCBoolean })
    private _isClockWise: boolean = true;
    @property({ type: CCFloat })
    private _distort: number = 1;

    @property({displayName:"每条边上的顶点数量"})
    public pointsCount:number = 10;

    public get rotateSpeed(): number {
        return this._rotateSpeed;
    }

    @property({ type: CCFloat })
    public set rotateSpeed(value: number) {
        if (this._rotateSpeed == value) return;
        this._rotateSpeed = value;

        // 😀😀😀 开始 😀😀😀
        this._updateRotateSpeed();
        // 😀😀😀 结束 😀😀😀
    }

    public get rotateCenter(): Vec2 {
        return this._rotateCenter;
    }

    @property({ type: Vec2 })
    public set rotateCenter(value: Vec2) {
        if (this._rotateCenter.equals(value)) return;
        this._rotateCenter.set(value);
        // 😀😀😀 开始 😀😀😀
        this._updateRotateCenter();
        // 😀😀😀 结束 😀😀😀
    }

    public get isClockWise(): boolean {
        return this._isClockWise;
    }

    @property({ type: CCBoolean })
    public set isClockWise(value: boolean) {
        if (this._isClockWise == value) return;
        this._isClockWise = value;
        // 😀😀😀 开始 😀😀😀
        this._updateRotateCenter();
        // 😀😀😀 结束 😀😀😀
    }

    public get distort(): number {
        return this._distort;
    }

    @property({ type: CCFloat })
    public set distort(value: number) {
        if (this._distort == value) return;
        this._distort = value;
        // 😀😀😀 开始 😀😀😀
        this._updateDistort();
        // 😀😀😀 结束 😀😀😀
    }
    public requestRenderData(drawInfoType?: __private._cocos_2d_renderer_render_draw_info__RenderDrawInfoType): RenderData {
        // 😀😀😀 开始 😀😀😀
        const data = RenderData.add([
            new gfx.Attribute(gfx.AttributeName.ATTR_POSITION, gfx.Format.RGB32F),
            new gfx.Attribute(gfx.AttributeName.ATTR_TEX_COORD, gfx.Format.RG32F),
            new gfx.Attribute(gfx.AttributeName.ATTR_COLOR, gfx.Format.RGBA32F),
            new gfx.Attribute("a_rotateSpeed", gfx.Format.R32F),
            new gfx.Attribute("a_rotateCenter", gfx.Format.RG32F),
            new gfx.Attribute("a_clockwise", gfx.Format.R32F),
            new gfx.Attribute("a_distort", gfx.Format.R32F),
        ]);
        // 😀😀😀 结束 😀😀😀
        data.initRenderDrawInfo(this, drawInfoType);
        this._renderData = data;
        return data;
    }

    private _updateRotateSpeed() {
        if (this._assembler) {
            this._assembler.updateRotateSpeed(this);
            this.markForUpdateRenderData();
        }
    }

    private _updateRotateCenter() {
        if (this._assembler) {
            this._assembler.updateRotateCenter(this);
            this.markForUpdateRenderData();
        }
    }

    private _updateaClockwise() {
        if (this._assembler) {
            this._assembler.updateaClockwise(this);
            this.markForUpdateRenderData();
        }
    }

    private _updateDistort() {
        if (this._assembler) {
            this._assembler.updateaDistort(this);
            this.markForUpdateRenderData();
        }
    }

    private _updateCustomVertexData() {
        this._updateRotateSpeed();
        this._updateRotateCenter();
        this._updateaClockwise();
        this._updateDistort();
    }

    public start(): void {
        this.scheduleOnce(() => {
            this._updateCustomVertexData();
        }, 0);
    }

    protected _flushAssembler() {
        // 😀😀😀 开始 😀😀😀
        const assembler = rotateAssembler;
        // 😀😀😀 结束 😀😀😀

        if (this._assembler !== assembler) {
            this.destroyRenderData();
            this._assembler = assembler;
        }

        if (!this._renderData) {
            if (this._assembler && this._assembler.createData) {
                this._renderData = this._assembler.createData(this);
                this._renderData!.material = this.getRenderMaterial(0);
                this.markForUpdateRenderData();
                if (this.spriteFrame) {
                    this._assembler.updateUVs(this);
                }
                this._updateColor();
                // 😀😀😀 开始 😀😀😀
                this._updateCustomVertexData();
                // 😀😀😀 结束 😀😀😀
            }
        }

        // 😀😀😀 注释掉下面几行 😀😀😀
        // // Only Sliced type need update uv when sprite frame insets changed
        // if (this._spriteFrame) {
        //     if (this._type === SpriteType.SLICED) {
        //         this._spriteFrame.on(SpriteFrame.EVENT_UV_UPDATED, this._updateUVs, this);
        //     } else {
        //         this._spriteFrame.off(SpriteFrame.EVENT_UV_UPDATED, this._updateUVs, this);
        //     }
        // }
    }

    public getPointCount() {
        return this.pointsCount;
    }
}


