import { _decorator, color, Color, Component, Material, MeshRenderer, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('OpacityLind3D')
export class OpacityLind3D extends Component {
    @property
    private alpha:number = 255;

    @property
    isSharedMode:boolean = false;

    private matInstances:Material[] = [];


    private mainColors:Color[] = [];

    protected onLoad(): void {
        if(!this.node.getChildByName("HXS_FK_1")) {
            
            console.log("=======hhhh");
        }
        var mr = this.node.getChildByName("HXS_FK_1").getComponent(MeshRenderer);
        var mat = mr.materials;

        
        if(this.isSharedMode == false) {
            for(let i = 0; i < mat.length; i++) {
                this.matInstances[i] = new Material();
                this.matInstances[i].copy(mat[i]);
                mr.setMaterial(this.matInstances[i], i);
                this.mainColors[i] = this.matInstances[i].getProperty("mainColor") as Color;
            }
        } else {
            this.matInstances = mat;
        }
        

    }
    public get Alpha():number {
        return this.alpha;
    }

    public set Alpha(alpha:number) {
        console.log(alpha, "==========alpha");
        this.alpha = alpha;
        for(let i = 0; i < this.matInstances.length; i++) {
            this.mainColors[i].a = alpha;
            this.matInstances[i].setProperty("mainColor", this.mainColors[i]);
        }
        
    }
    start() {

    }

    update(deltaTime: number) {
        
    }
}


