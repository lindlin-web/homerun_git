import { _decorator, Component, dragonBones, instantiate, Node, Prefab, tween, UITransform, v2, v3, Vec2, Vec3 } from 'cc';
import { DragNode } from './DragNode';
const { ccclass, property } = _decorator;

export const POSITIONS:Vec3[] = [v3(-120,-70,0), v3(0,-70,0),v3(120,-70,0),v3(240, -70,0)];

const TempPosition:Vec3 = v3(240, -80,0);

let NUMBERLINE:number[] = [5,6,7,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24];
@ccclass('ContainerWigs')
export class ContainerWigs extends Component {
    @property(DragNode)
    dragNode:DragNode = null;               // 这个是第一个的东西。

    @property(DragNode)
    dragNode1:DragNode = null;               // 这个是第二个的东西。

    @property(DragNode)
    dragNode2:DragNode = null;               // 这个是第三个的东西。

    @property(Prefab)
    prefab:Prefab = null;

    onLoad() {
        console.log("=11111d=");
    }
    start() {
        this.dragNode.setMyIndex(1);
        this.dragNode.node.setPosition(POSITIONS[0]);

        this.dragNode1.setMyIndex(2);
        this.dragNode1.node.setPosition(POSITIONS[1]);

        this.dragNode2.setMyIndex(3);
        this.dragNode2.node.setPosition(POSITIONS[2]);
    }

    showByIndex(index:number) {
        let resultNode = this.findDragNodeByIndex(index);
        resultNode.node.active = true;
    }

    getFirstIndex():number {
        return this.dragNode.getIndex();
    }

    doneWithNodeIndex(index:number) {
        let prefab = instantiate(this.prefab);
        this.node.getChildByName("content").addChild(prefab);
        let number = NUMBERLINE.shift();
        prefab.getComponent(DragNode).setMyIndex(number);
        prefab.setPosition(POSITIONS[3]);

        let tempNode = this.findDragNodeByIndex(index);
        // 如果被移除的是，第一个节点的话
        if(tempNode == this.dragNode) {
            this.dragNode = this.dragNode1;

            this.moveForward(this.dragNode,0);
            this.dragNode1 = this.dragNode2;
            this.moveForward(this.dragNode1,1);
            this.dragNode2 = prefab.getComponent(DragNode);
            this.moveForward(this.dragNode2,2);
        }
        else if(tempNode == this.dragNode1) {
            this.dragNode1 = this.dragNode2;
            this.moveForward(this.dragNode1,1);
            this.dragNode2 = prefab.getComponent(DragNode);
            this.moveForward(this.dragNode2,2);
        }
        else if(tempNode == this.dragNode2) {
            this.dragNode2 = prefab.getComponent(DragNode);
            this.moveForward(this.dragNode2,2);
        }
        let node = tempNode.node;
        node.removeFromParent();
        node.destroy();
        node = null;
    }

    moveForward(temp:DragNode,index:number) {
        let node = temp.node;
        let targetPosition:Vec3 = POSITIONS[index];
        tween(node).to(0.1, {position:targetPosition}).start();
    }
    
    getWorldPos(index:number) {
        let resultNode = this.findDragNodeByIndex(index);
        if(resultNode) {
            return resultNode.getComponent(UITransform).convertToWorldSpaceAR(v3(0,0,0));
        }
    }

    /** 看看点击了哪一个node */
    hitTest(uiPoint):DragNode {
        let bo = this.dragNode.testIsHit(uiPoint);
        if(bo) {
            let active = this.dragNode.node.active;
            if(!active) {
                return null;
            } else 
            {
                this.dragNode.node.active = false;
                return this.dragNode;
            }
        }

        bo = this.dragNode1.testIsHit(uiPoint);
        if(bo) {
            let active = this.dragNode1.node.active;
            if(!active) {
                return null
            } else {
                this.dragNode1.node.active = false;
                return this.dragNode1;
            }
        }
        bo = this.dragNode2.testIsHit(uiPoint);
        if(bo) {
            let active = this.dragNode2.node.active;
            if(!active) {
                return null;
            } 
            else {
                this.dragNode2.node.active = false;
                return this.dragNode2;
            }
        }
        return null;
    }





    findDragNodeByIndex(index:number) {
        let resultNode = this.dragNode.getIndex() == index ? this.dragNode : this.dragNode1.getIndex() == index ? this.dragNode1: this.dragNode2.getIndex() == index ? this.dragNode2: null;
        return resultNode;
    }

    update(deltaTime: number) {
        
    }
}


