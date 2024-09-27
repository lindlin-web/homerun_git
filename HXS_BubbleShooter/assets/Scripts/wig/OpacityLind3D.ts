import { _decorator, color, Color, Component, Material, MeshRenderer, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('OpacityLind3D')
export class OpacityLind3D extends Component {
    @property
    private colorlind:Color = color(0,0,0,0);

    @property
    isSharedMode:boolean = false;

    private matInstances:Material[] = [];


    private mainColors:Color[] = [];

    protected onLoad(): void {
        if(!this.node) {
            console.log("=======hhhh");
        }
        var mr = this.node.getComponent(MeshRenderer);
        var mat = mr.materials;
        if(this.isSharedMode == false) {
            for(let i = 0; i < mat.length; i++) {
                this.matInstances[i] = new Material();
                this.matInstances[i].copy(mat[i]);
                mr.setMaterial(this.matInstances[i], i);
                this.mainColors[i] = this.matInstances[i].getProperty("mainColor") as Color;
                this.colorlind = this.mainColors[i];
            }
        } else {
            this.matInstances = mat;
        }
    }
    public get MyColor():Color {
        return this.colorlind;
    }

    public set MyColor(c:Color) {
        this.colorlind = c;
        for(let i = 0; i < this.matInstances.length; i++) {
            this.mainColors[i] = c;
            this.matInstances[i].setProperty("mainColor", this.mainColors[i]);
        }
        
    }
    start() {

    }

    update(deltaTime: number) {
        
    }
}


