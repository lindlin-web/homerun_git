/*
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

/**
 * @packageDocumentation
 * @module ui-assembler
 */
import { DynamicAtlasManager, IAssembler, IRenderData, RenderData, Sprite, Vec2 } from "cc";
import { RotateSprite } from "./RotateSprite";
let QUAD_INDICES = Uint16Array.from([0, 1, 2, 1, 3, 2,4,5,6,5,7,6]);

/**
 * simple 组装器
 * 可通过 `UI.simple` 获取该组装器。
 */
export const rotateAssembler: IAssembler = {
    createData (sprite: RotateSprite) {

        let segmentCount = sprite.getPointCount()-1;
        let verticesCount = segmentCount * 4;
        let indicesCount = segmentCount *  6;
        const renderData = sprite.requestRenderData();
        renderData.dataLength = verticesCount;
        renderData.resize(verticesCount, indicesCount);
        renderData.vertexRow = 2;
        renderData.vertexCol = 2;

        
        renderData.chunk.setIndexBuffer(QUAD_INDICES);
        return renderData;
    },

    updateRenderData (sprite: RotateSprite) {
        const frame = sprite.spriteFrame;

        //DynamicAtlasManager.instance.packToDynamicAtlas(sprite, frame);
        this.updateUVs(sprite);// dirty need
        //this.updateColor(sprite);// dirty need

        const renderData = sprite.renderData;
        renderData.vertDirty = true;
        if (renderData && frame) {
            if (renderData.vertDirty) {
                this.updateVertexDataLeftToRight(sprite);
                // 😀😀😀 开始 😀😀😀
                this.updateCustomVertexData(sprite);
                // 😀😀😀 结束 😀😀😀
            }
            renderData.updateRenderData(sprite, frame);
        }
    },

    updateWorldVerts (sprite: Sprite, chunk: any) {
        const renderData = sprite.renderData!;
        const vData = chunk.vb;

        const dataList: IRenderData[] = renderData.data;
        const node = sprite.node;
        const m = node.worldMatrix;

        const uiTrans = sprite.node._uiProps.uiTransformComp!;
        const cw = uiTrans.width;
        const ch = uiTrans.height;
        const appX = uiTrans.anchorX * cw;
        const appY = uiTrans.anchorY * ch;
        let height = ch;
        let width = cw;



        const stride = renderData.floatStride;
        let offset = 0;
        const length = dataList.length;
        for (let i = 0; i < length; i++) {
            const curData = dataList[i];
            const x = curData.x;
            const y = curData.y;
            let rhw = m.m03 * x + m.m07 * y + m.m15;
            rhw = rhw ? Math.abs(1 / rhw) : 1;

            offset = i * stride;
            vData[offset + 0] = (m.m00 * x + m.m04 * y + m.m12) * rhw;
            vData[offset + 1] = (m.m01 * x + m.m05 * y + m.m13) * rhw;
            vData[offset + 2] = (m.m02 * x + m.m06 * y + m.m14) * rhw;
        }
    },

    fillBuffers (sprite: RotateSprite, renderer: any) {
        if (sprite === null) {
            return;
        }

        const renderData = sprite.renderData!;
        const chunk = renderData.chunk;
        if (sprite.node.hasChangedFlags || renderData.vertDirty) {
            // const vb = chunk.vertexAccessor.getVertexBuffer(chunk.bufferId);
            this.updateWorldVerts(sprite, chunk);
            // 😀😀😀 开始 😀😀😀
            this.updateCustomVertexData(sprite);
            // 😀😀😀 结束 😀😀😀
            renderData.vertDirty = false;
        }
        // quick version
        const bid = chunk.bufferId;
        const vidOrigin = chunk.vertexOffset;
        const meshBuffer = chunk.meshBuffer;
        const ib = chunk.meshBuffer.iData;
        let indexOffset = meshBuffer.indexOffset;

        // rect count = vertex count - 1
        // for (let curRow = 0; curRow < renderData.vertexRow - 1; curRow++) {
        //     for (let curCol = 0; curCol < renderData.vertexCol - 1; curCol++) {
        //         // vid is the index of the left bottom vertex in each rect.
        //         const vid = vidOrigin + curRow * renderData.vertexCol + curCol;

        //         // left bottom
        //         ib[indexOffset++] = vid;
        //         // right bottom
        //         ib[indexOffset++] = vid + 1;
        //         // left top
        //         ib[indexOffset++] = vid + 2;

        //         // right bottom
        //         ib[indexOffset++] = vid + 1;
        //         // right top
        //         ib[indexOffset++] = vid + 3;
        //         // left top
        //         ib[indexOffset++] = vid + 2;

        //         // IndexOffset should add 6 when vertices of a rect are visited.
        //         //meshBuffer.indexOffset += 6;
        //     }
        // }

        let segmentCount = sprite.getPointCount()-1;
        indexOffset = meshBuffer.indexOffset;
        for(let i = 0; i < segmentCount; i++) {
            let vid = vidOrigin + i * 3;

            // left bottom
            ib[indexOffset++] = vid;
            // right bottom
            ib[indexOffset++] = vid + 1;
            // left top
            ib[indexOffset++] = vid + 2;

            // right bottom
            ib[indexOffset++] = vid + 1;
            // right top
            ib[indexOffset++] = vid + 3;
            // left top
            ib[indexOffset++] = vid + 2;

            // IndexOffset should add 6 when vertices of a rect are visited.

            meshBuffer.indexOffset += 6;
        }
        

        // slow version
        // renderer.switchBufferAccessor().appendIndices(chunk);
    },

    updateVertexDataLeftToRight (sprite: RotateSprite) {
        const renderData: RenderData | null = sprite.renderData;
        if (!renderData) {
            return;
        }

        const uiTrans = sprite.node._uiProps.uiTransformComp!;
        const dataList: IRenderData[] = renderData.data;
        const cw = uiTrans.width;
        const ch = uiTrans.height;
        const appX = uiTrans.anchorX * cw;
        const appY = uiTrans.anchorY * ch;
        let l = 0;
        let b = 0;
        let r = 0;
        let t = 0;
        if (sprite.trim) {
            l = -appX;
            b = -appY;
            r = cw - appX;
            t = ch - appY;
        } else {
            const frame = sprite.spriteFrame!;
            const originSize = frame.originalSize;
            const ow = originSize.width;
            const oh = originSize.height;
            const scaleX = cw / ow;
            const scaleY = ch / oh;
            const trimmedBorder = frame.trimmedBorder;
            l = trimmedBorder.x * scaleX - appX;
            b = trimmedBorder.z * scaleY - appY;
            r = cw + trimmedBorder.y * scaleX - appX;
            t = ch + trimmedBorder.w * scaleY - appY;
        }

        let pointNum: number = sprite.getPointCount();
        let width = cw;
        let height = ch;
        // 左下角的坐标
        let posX = - width * uiTrans.anchorX;
        let posY = - height * uiTrans.anchorY;
        // 根据角度获得控制点的位置
        let ctrlPosData = this._getCtrlPosByAngle(width);
        let startPos = ctrlPosData.startPos
        let endPos = ctrlPosData.endPos
        let ctrlPos1 = ctrlPosData.ctrlPos1
        let ctrlPos2 = ctrlPosData.ctrlPos2
        // 记录各个顶点的位置
        let bezierPosList: Vec2[] = []
        bezierPosList[0] = startPos
        // 当前所有顶点连线的总长
        let realWidth = 0
        // 上一个点的纹理坐标
        let lastU = 0
        // 下一个点的纹理坐标
        let nextU = 0
        // 写verts时的下标
        let dstOffset = 0;

        const floatsPerVert = renderData.floatStride;
        for(let i  = 1; i < pointNum; i++) {
            let isTail = i === pointNum - 1
            let lastBezierPos = bezierPosList[i - 1]
            let nextBezierPos = this._getBezierPos(i / (pointNum - 1) , startPos.clone(), endPos.clone(), ctrlPos1.clone(), ctrlPos2.clone())
            let fixedData = this._fixWidth(lastBezierPos.clone(), nextBezierPos.clone(), width, realWidth, isTail)
            let gapWidth = fixedData.gapWidth;
            nextBezierPos = fixedData.nextBezierPos;
            realWidth += gapWidth
            bezierPosList[i] = nextBezierPos.clone();
            // 根据当前小矩形的宽度占总长度的比例来计算纹理坐标的间隔
            let gapU = gapWidth / width
            nextU = lastU + gapU;

            dstOffset = (i-1) * 4;
            dataList[dstOffset].x = posX + lastBezierPos.x;
            dataList[dstOffset].y = posY + lastBezierPos.y;
            dataList[dstOffset].u = lastU;
            dataList[dstOffset].v = 1;

            dataList[dstOffset+1].x = posX + nextBezierPos.x;
            dataList[dstOffset+1].y = posY + nextBezierPos.y;
            dataList[dstOffset+1].u = nextU;
            dataList[dstOffset+1].v = 1;

            dataList[dstOffset+2].x = posX + lastBezierPos.x;
            dataList[dstOffset+2].y = posY + height + lastBezierPos.y;
            dataList[dstOffset+2].u = lastU;
            dataList[dstOffset+2].v = 0;

            dataList[dstOffset+3].x = posX + nextBezierPos.x;
            dataList[dstOffset+3].y = posY + height + nextBezierPos.y;
            dataList[dstOffset+3].u = nextU;
            dataList[dstOffset+3].v = 0;
            lastU = nextU
        }
        renderData.vertDirty = true;
    },



    updateVertexDataRightToLeft (sprite: RotateSprite) {
        const renderData: RenderData | null = sprite.renderData;
        if (!renderData) {
            return;
        }

        const uiTrans = sprite.node._uiProps.uiTransformComp!;
        const dataList: IRenderData[] = renderData.data;
        const cw = uiTrans.width;
        const ch = uiTrans.height;
        const appX = uiTrans.anchorX * cw;
        const appY = uiTrans.anchorY * ch;
        let l = 0;
        let b = 0;
        let r = 0;
        let t = 0;
        if (sprite.trim) {
            l = -appX;
            b = -appY;
            r = cw - appX;
            t = ch - appY;
        } else {
            const frame = sprite.spriteFrame!;
            const originSize = frame.originalSize;
            const ow = originSize.width;
            const oh = originSize.height;
            const scaleX = cw / ow;
            const scaleY = ch / oh;
            const trimmedBorder = frame.trimmedBorder;
            l = trimmedBorder.x * scaleX - appX;
            b = trimmedBorder.z * scaleY - appY;
            r = cw + trimmedBorder.y * scaleX - appX;
            t = ch + trimmedBorder.w * scaleY - appY;
        }

        let pointNum: number = sprite.getPointCount();
        let width = cw;
        let height = ch;
        // 左下角的坐标
        let posX = width * uiTrans.anchorX;
        let posY = - height * uiTrans.anchorY;
        // 根据角度获得控制点的位置
        let ctrlPosData = this._getCtrlPosByAngle(width);
        let startPos = ctrlPosData.startPos
        let endPos = ctrlPosData.endPos
        let ctrlPos1 = ctrlPosData.ctrlPos1
        let ctrlPos2 = ctrlPosData.ctrlPos2
        // 记录各个顶点的位置
        let bezierPosList: Vec2[] = []
        bezierPosList[0] = startPos
        // 当前所有顶点连线的总长
        let realWidth = 0
        // 上一个点的纹理坐标
        let lastU = 0
        // 下一个点的纹理坐标
        let nextU = 0
        // 写verts时的下标
        let dstOffset = 0;

        const floatsPerVert = renderData.floatStride;
        for(let i  = 1; i < pointNum; i++) {
            let isTail = i === pointNum - 1
            let lastBezierPos = bezierPosList[i - 1]
            let nextBezierPos = this._getBezierPos(i / (pointNum - 1) , startPos.clone(), endPos.clone(), ctrlPos1.clone(), ctrlPos2.clone())
            let fixedData = this._fixWidth(lastBezierPos.clone(), nextBezierPos.clone(), width, realWidth, isTail)
            let gapWidth = fixedData.gapWidth;
            nextBezierPos = fixedData.nextBezierPos;
            realWidth += gapWidth
            bezierPosList[i] = nextBezierPos.clone();
            // 根据当前小矩形的宽度占总长度的比例来计算纹理坐标的间隔
            let gapU = gapWidth / width
            nextU = lastU + gapU;

            dstOffset = (i-1) * 4;
            dataList[dstOffset].x = posX - lastBezierPos.x;
            dataList[dstOffset].y = posY + lastBezierPos.y;
            dataList[dstOffset].u = 1-lastU;
            dataList[dstOffset].v = 1;

            dataList[dstOffset+1].x = posX - nextBezierPos.x;
            dataList[dstOffset+1].y = posY + nextBezierPos.y;
            dataList[dstOffset+1].u = 1-nextU;
            dataList[dstOffset+1].v = 1;

            dataList[dstOffset+2].x = posX - lastBezierPos.x;
            dataList[dstOffset+2].y = posY + height + lastBezierPos.y;
            dataList[dstOffset+2].u = 1-lastU;
            dataList[dstOffset+2].v = 0;

            dataList[dstOffset+3].x = posX - nextBezierPos.x;
            dataList[dstOffset+3].y = posY + height + nextBezierPos.y;
            dataList[dstOffset+3].u = 1-nextU;
            dataList[dstOffset+3].v = 0;
            lastU = nextU
        }
        renderData.vertDirty = true;
    },



    updateVertexDataTopToBottom (sprite: RotateSprite) {
        const renderData: RenderData | null = sprite.renderData;
        if (!renderData) {
            return;
        }

        const uiTrans = sprite.node._uiProps.uiTransformComp!;
        const dataList: IRenderData[] = renderData.data;
        const cw = uiTrans.width;
        const ch = uiTrans.height;
        const appX = uiTrans.anchorX * cw;
        const appY = uiTrans.anchorY * ch;
        let l = 0;
        let b = 0;
        let r = 0;
        let t = 0;
        if (sprite.trim) {
            l = -appX;
            b = -appY;
            r = cw - appX;
            t = ch - appY;
        } else {
            const frame = sprite.spriteFrame!;
            const originSize = frame.originalSize;
            const ow = originSize.width;
            const oh = originSize.height;
            const scaleX = cw / ow;
            const scaleY = ch / oh;
            const trimmedBorder = frame.trimmedBorder;
            l = trimmedBorder.x * scaleX - appX;
            b = trimmedBorder.z * scaleY - appY;
            r = cw + trimmedBorder.y * scaleX - appX;
            t = ch + trimmedBorder.w * scaleY - appY;
        }

        let pointNum: number = sprite.getPointCount();
        let width = cw;
        let height = ch;
        // 左下角的坐标
        let posX =  height * uiTrans.anchorX;
        let posY = -width * uiTrans.anchorY;
        // 根据角度获得控制点的位置
        let ctrlPosData = this._getCtrlPosByAngle(height);
        let startPos = ctrlPosData.startPos;
        let endPos = ctrlPosData.endPos;
        let ctrlPos1 = ctrlPosData.ctrlPos1;
        let ctrlPos2 = ctrlPosData.ctrlPos2;
        // 记录各个顶点的位置
        let bezierPosList: Vec2[] = []
        bezierPosList[0] = startPos
        // 当前所有顶点连线的总长
        let realWidth = 0
        // 上一个点的纹理坐标
        let lastU = 0
        // 下一个点的纹理坐标
        let nextU = 0
        // 写verts时的下标
        let dstOffset = 0;

        const floatsPerVert = renderData.floatStride;
        for(let i  = 1; i < pointNum; i++) {
            let isTail = i === pointNum - 1
            let lastBezierPos = bezierPosList[i - 1]
            let nextBezierPos = this._getBezierPos(i / (pointNum - 1) , startPos.clone(), endPos.clone(), ctrlPos1.clone(), ctrlPos2.clone())
            let fixedData = this._fixWidth(lastBezierPos.clone(), nextBezierPos.clone(), width, realWidth, isTail)
            let gapWidth = fixedData.gapWidth;
            nextBezierPos = fixedData.nextBezierPos;
            realWidth += gapWidth
            bezierPosList[i] = nextBezierPos.clone();
            // 根据当前小矩形的宽度占总长度的比例来计算纹理坐标的间隔
            let gapU = gapWidth / width
            nextU = lastU + gapU;

            dstOffset = (i-1) * 4;
            dataList[dstOffset].x = posX - lastBezierPos.x;
            dataList[dstOffset].y = posY + lastBezierPos.y;
            dataList[dstOffset].u = lastU;
            dataList[dstOffset].v = 0;

            dataList[dstOffset+1].x = posX - nextBezierPos.x;
            dataList[dstOffset+1].y = posY + nextBezierPos.y;
            dataList[dstOffset+1].u = nextU;
            dataList[dstOffset+1].v = 0;

            dataList[dstOffset+2].x = posX - lastBezierPos.x;
            dataList[dstOffset+2].y = posY + width + lastBezierPos.y;
            dataList[dstOffset+2].u = lastU;
            dataList[dstOffset+2].v = 1;

            dataList[dstOffset+3].x = posX - nextBezierPos.x;
            dataList[dstOffset+3].y = posY + width + nextBezierPos.y;
            dataList[dstOffset+3].u = nextU;
            dataList[dstOffset+3].v = 1;
            lastU = nextU
        }
        for(let i = 1; i < pointNum; i++) {
            dstOffset = (i-1) * 4;
            let temp = dataList[dstOffset].x;
            dataList[dstOffset].x = dataList[dstOffset].y;
            dataList[dstOffset].y = temp;

            temp = dataList[dstOffset].u;
            dataList[dstOffset].u = dataList[dstOffset].v;
            dataList[dstOffset].v = temp;

            temp = dataList[dstOffset+1].x;
            dataList[dstOffset+1].x = dataList[dstOffset+1].y;
            dataList[dstOffset+1].y = temp;

            temp = dataList[dstOffset+1].u;
            dataList[dstOffset+1].u = dataList[dstOffset+1].v;
            dataList[dstOffset+1].v = temp;

            temp = dataList[dstOffset+2].x;
            dataList[dstOffset+2].x = dataList[dstOffset+2].y;
            dataList[dstOffset+2].y = temp;

            temp = dataList[dstOffset+2].u;
            dataList[dstOffset+2].u = dataList[dstOffset+2].v;
            dataList[dstOffset+2].v = temp;


            temp = dataList[dstOffset+3].x;
            dataList[dstOffset+3].x = dataList[dstOffset+3].y;
            dataList[dstOffset+3].y = temp;

            temp = dataList[dstOffset+3].u;
            dataList[dstOffset+3].u = dataList[dstOffset+3].v;
            dataList[dstOffset+3].v = temp;
        }
        renderData.vertDirty = true;
    },


    updateVertexDataBottomToTop (sprite: RotateSprite) {
        const renderData: RenderData | null = sprite.renderData;
        if (!renderData) {
            return;
        }

        const uiTrans = sprite.node._uiProps.uiTransformComp!;
        const dataList: IRenderData[] = renderData.data;
        const cw = uiTrans.width;
        const ch = uiTrans.height;
        const appX = uiTrans.anchorX * cw;
        const appY = uiTrans.anchorY * ch;
        let l = 0;
        let b = 0;
        let r = 0;
        let t = 0;
        if (sprite.trim) {
            l = -appX;
            b = -appY;
            r = cw - appX;
            t = ch - appY;
        } else {
            const frame = sprite.spriteFrame!;
            const originSize = frame.originalSize;
            const ow = originSize.width;
            const oh = originSize.height;
            const scaleX = cw / ow;
            const scaleY = ch / oh;
            const trimmedBorder = frame.trimmedBorder;
            l = trimmedBorder.x * scaleX - appX;
            b = trimmedBorder.z * scaleY - appY;
            r = cw + trimmedBorder.y * scaleX - appX;
            t = ch + trimmedBorder.w * scaleY - appY;
        }

        let pointNum: number = sprite.getPointCount();
        let width = cw;
        let height = ch;
        // 左下角的坐标
        let posX =  -height * uiTrans.anchorX;
        let posY = -width * uiTrans.anchorY;
        // 根据角度获得控制点的位置
        let ctrlPosData = this._getCtrlPosByAngle(height);
        let startPos = ctrlPosData.startPos;
        let endPos = ctrlPosData.endPos;
        let ctrlPos1 = ctrlPosData.ctrlPos1;
        let ctrlPos2 = ctrlPosData.ctrlPos2;
        // 记录各个顶点的位置
        let bezierPosList: Vec2[] = []
        bezierPosList[0] = startPos
        // 当前所有顶点连线的总长
        let realWidth = 0
        // 上一个点的纹理坐标
        let lastU = 0
        // 下一个点的纹理坐标
        let nextU = 0
        // 写verts时的下标
        let dstOffset = 0;

        const floatsPerVert = renderData.floatStride;
        for(let i  = 1; i < pointNum; i++) {
            let isTail = i === pointNum - 1
            let lastBezierPos = bezierPosList[i - 1]
            let nextBezierPos = this._getBezierPos(i / (pointNum - 1) , startPos.clone(), endPos.clone(), ctrlPos1.clone(), ctrlPos2.clone())
            let fixedData = this._fixWidth(lastBezierPos.clone(), nextBezierPos.clone(), width, realWidth, isTail)
            let gapWidth = fixedData.gapWidth;
            nextBezierPos = fixedData.nextBezierPos;
            realWidth += gapWidth
            bezierPosList[i] = nextBezierPos.clone();
            // 根据当前小矩形的宽度占总长度的比例来计算纹理坐标的间隔
            let gapU = gapWidth / width
            nextU = lastU + gapU;

            dstOffset = (i-1) * 4;
            dataList[dstOffset].x = posX + lastBezierPos.x;
            dataList[dstOffset].y = posY + lastBezierPos.y;
            dataList[dstOffset].u = 1-lastU;
            dataList[dstOffset].v = 0;

            dataList[dstOffset+1].x = posX + nextBezierPos.x;
            dataList[dstOffset+1].y = posY + nextBezierPos.y;
            dataList[dstOffset+1].u = 1-nextU;
            dataList[dstOffset+1].v = 0;

            dataList[dstOffset+2].x = posX + lastBezierPos.x;
            dataList[dstOffset+2].y = posY + width + lastBezierPos.y;
            dataList[dstOffset+2].u = 1-lastU;
            dataList[dstOffset+2].v = 1;

            dataList[dstOffset+3].x = posX + nextBezierPos.x;
            dataList[dstOffset+3].y = posY + width + nextBezierPos.y;
            dataList[dstOffset+3].u = 1-nextU;
            dataList[dstOffset+3].v = 1;
            lastU = nextU
        }
        for(let i = 1; i < pointNum; i++) {
            dstOffset = (i-1) * 4;
            let temp = dataList[dstOffset].x;
            dataList[dstOffset].x = dataList[dstOffset].y;
            dataList[dstOffset].y = temp;

            temp = dataList[dstOffset].u;
            dataList[dstOffset].u = dataList[dstOffset].v;
            dataList[dstOffset].v = temp;

            temp = dataList[dstOffset+1].x;
            dataList[dstOffset+1].x = dataList[dstOffset+1].y;
            dataList[dstOffset+1].y = temp;

            temp = dataList[dstOffset+1].u;
            dataList[dstOffset+1].u = dataList[dstOffset+1].v;
            dataList[dstOffset+1].v = temp;

            temp = dataList[dstOffset+2].x;
            dataList[dstOffset+2].x = dataList[dstOffset+2].y;
            dataList[dstOffset+2].y = temp;

            temp = dataList[dstOffset+2].u;
            dataList[dstOffset+2].u = dataList[dstOffset+2].v;
            dataList[dstOffset+2].v = temp;


            temp = dataList[dstOffset+3].x;
            dataList[dstOffset+3].x = dataList[dstOffset+3].y;
            dataList[dstOffset+3].y = temp;

            temp = dataList[dstOffset+3].u;
            dataList[dstOffset+3].u = dataList[dstOffset+3].v;
            dataList[dstOffset+3].v = temp;
        }
        renderData.vertDirty = true;
    },

    updateUVs (sprite: RotateSprite) {
        if (!sprite.spriteFrame) return;
        const renderData = sprite.renderData!;
        const vData = renderData.chunk.vb;
        const uv = sprite.spriteFrame.uv;

        const dataList: IRenderData[] = renderData.data;
        // uv[0] = 0.0;
        // uv[1] = 1.0;
        // uv[2] = 0.5;
        // uv[3] = 1.0;
        // uv[4] = 0;
        // uv[5] = 0.0;
        // uv[6] = 0.5;
        // uv[7] = 0;


        // uv[8] = 0.5;
        // uv[9] = 1.0;
        // uv[10] = 1.0;
        // uv[11] = 1.0;
        // uv[12] = 0.5;
        // uv[13] = 0.0;
        // uv[14] = 1.0;
        // uv[15] = 0;
        
        // 😀😀😀 开始 😀😀😀
        let offset = 3;
        let count = 0;

        let segmentCount = sprite.getPointCount()-1;
        let verticesCount = segmentCount * 4;
        for (let i = 0; i < verticesCount; i++, offset += renderData.floatStride) {
            vData[offset] = dataList[count].u;
            vData[offset + 1] = dataList[count].v;
            count ++;
        }
        // 😀😀😀 结束 😀😀😀
    },

    updateColor (sprite: RotateSprite) {
        const renderData = sprite.renderData!;
        const vData = renderData.chunk.vb;
        let colorOffset = 5;
        const color = sprite.color;
        const colorR = color.r / 255;
        const colorG = color.g / 255;
        const colorB = color.b / 255;
        const colorA = color.a / 255;

        let segmentCount = sprite.getPointCount()-1;
        let verticesCount = segmentCount * 4;
        for (let i = 0; i < verticesCount; i++, colorOffset += renderData.floatStride) {
            vData[colorOffset] = colorR;
            vData[colorOffset + 1] = colorG;
            vData[colorOffset + 2] = colorB;
            vData[colorOffset + 3] = colorA;
        }
    },

    updateRotateSpeed(sprite: RotateSprite) {
        const renderData = sprite.renderData!;
        const vData = renderData.chunk.vb;
        let offset = 9;
        for (let i = 0; i < 4; i++, offset += renderData.floatStride) {
            vData[offset] = sprite.rotateSpeed;
        }
    },

    updateRotateCenter(sprite: RotateSprite) {
        const renderData = sprite.renderData!;
        const vData = renderData.chunk.vb;
        let offset = 10;
        for (let i = 0; i < 4; i++, offset += renderData.floatStride) {
            vData[offset] = sprite.rotateCenter.x;
            vData[offset + 1] = sprite.rotateCenter.y;
        }
    },

    updateaClockwise(sprite: RotateSprite) {
        const renderData = sprite.renderData!;
        const vData = renderData.chunk.vb;
        let offset = 12;
        for (let i = 0; i < 4; i++, offset += renderData.floatStride) {
            vData[offset] = sprite.isClockWise ? 1 : -1;
        }
    },

    updateaDistort(sprite: RotateSprite) {
        const renderData = sprite.renderData!;
        const vData = renderData.chunk.vb;
        let offset = 13;
        for (let i = 0; i < 4; i++, offset += renderData.floatStride) {
            vData[offset] = sprite.distort;
        }
    },

    updateCustomVertexData(sprite: Sprite) {
        this.updateRotateSpeed(sprite);
        this.updateRotateCenter(sprite);
        this.updateaClockwise(sprite);
        this.updateaDistort(sprite);
    },


    _getCtrlPosByAngle(width:number): {startPos: Vec2, endPos: Vec2, ctrlPos1: Vec2, ctrlPos2: Vec2}
    {
        let startPos = new Vec2(0, 0)
        let endPos = null
        let ctrlPos1 = null
        let ctrlPos2 = null;

        console.log(this.angle, "=========this.anglethis.anglethis.angle");
        let rad = this.angle * Math.PI / 180
        let per = rad * 2 / Math.PI
        if(this.angle <= 90) {
            // 终点的x坐标变换 width => 0，速度先慢后快，使用InCubic缓动函数
            let endPosX = width * (1 - Math.pow(per, 3))
            // InCubic
            // 终点的y坐标变换 0 => width / 4, 速度先快后慢，使用OutQuart缓动函数
            let endPosY = width / 4 * (1 - Math.pow(1 - per, 4))
            endPos = new Vec2(endPosX, endPosY)

            // 中间两个控制点坐标匀速变换
            // x坐标 width => width * 3 / 4
            let ctrlPosX = width * (1 - 1 / 4 * per)
            // 控制点1y坐标 0 => width / 16
            let ctrlPos1Y = width * 1 / 16 * per
            // 控制点2y坐标 0 => width * 3 / 16
            let ctrlPos2Y = width * 3 / 16 * per
            ctrlPos1 = new Vec2(ctrlPosX, ctrlPos1Y)
            ctrlPos2 = new Vec2(ctrlPosX, ctrlPos2Y)
        } else {
            per = per - 1
            // 终点的x坐标变换 0 => width，速度先快后慢，使用OutCubic缓动函数
            let endPosX = - width * (1 - Math.pow(1 - per, 3))
            // 终点的y坐标变换 width / 4 => 0, 速度先慢后快，使用InQuart缓动函数
            let endPosY = width / 4 * (1 - Math.pow(per, 4))
            endPos = new Vec2(endPosX, endPosY)

            // 控制点1x坐标 width * 3 / 4 => 0
            let ctrlPos1X = width * 3 / 4 * (1 - per)
            // 控制点2x坐标 width * 3 / 4 => 0
            let ctrlPos2X = width * 3 / 4 * Math.pow(1 - per, 3)
            // 控制点1y坐标 width / 16 => 0
            let ctrlPos1Y = width * 1 / 16 *  (1 - per)
            // 控制点2y坐标 width * 3 / 16 => 0
            let ctrlPos2Y = width * 3 / 16 * (1 - Math.pow(per, 4))
            ctrlPos1 = new Vec2(ctrlPos1X, ctrlPos1Y)
            ctrlPos2 = new Vec2(ctrlPos2X, ctrlPos2Y)
        }

        return {
            startPos: startPos,
            endPos: endPos,
            ctrlPos1: ctrlPos1,
            ctrlPos2: ctrlPos2
        }
    },


    // 修正宽度
    _fixWidth(lastBezierPos: Vec2, nextBezierPos: Vec2, width: number, realWidth: number, isTail: boolean) {
        let deltaVector = nextBezierPos.clone().subtract(lastBezierPos)
        // 两个顶点的间距
        let gapWidth = deltaVector.length()
        // 当前的总长
        let curWidth = realWidth + gapWidth
        if(isTail) {
            // 如果是最后一个顶点则将总长度修正至书页的真实宽度
            gapWidth = width - realWidth
            let direction = deltaVector.normalize()
            nextBezierPos = lastBezierPos.clone().add(direction.multiplyScalar(gapWidth))
        } else if(curWidth >= width) {
            // 如果当前总长超过了书页的真实宽度，就衰减超过部分的1.1倍
            let delta = curWidth - width
            gapWidth = gapWidth - delta * 1.1
            gapWidth = Math.max(0, gapWidth)
            let direction = deltaVector.normalize()
            nextBezierPos = lastBezierPos.clone().add(direction.multiplyScalar(gapWidth))
        }

        return {
            gapWidth: gapWidth,
            nextBezierPos: nextBezierPos,
        }
    },

    // 贝塞尔曲线公式
    _getBezierPos(t: number, startPos: Vec2, endPos: Vec2, ctrlPos1: Vec2, ctrlPos2: Vec2): Vec2 {
        startPos = startPos.multiplyScalar(Math.pow(1 - t, 3))
        ctrlPos1 = ctrlPos1.multiplyScalar(3 * t * Math.pow(1 - t, 2))
        ctrlPos2 = ctrlPos2.multiplyScalar(3 * (1 - t) * Math.pow(t, 2))
        endPos = endPos.multiplyScalar(Math.pow(t, 3))
        return startPos.add(ctrlPos1.add(ctrlPos2.add(endPos)))
    }
};
