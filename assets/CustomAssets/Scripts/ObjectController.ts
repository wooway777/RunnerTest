import { _decorator, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ObjectController')
export class ObjectController extends Component {

    @property([Node])
    roadSideObjects: Node[] = [];

    @property
    bounds: number[] = [-0.3, 0.3];

    start() {
        this.randomizeObject();
    }

    update(deltaTime: number) {
        
    }

    public randomizeObject () {
        let randomIndex = Math.floor(Math.random() * this.roadSideObjects.length);

        // Loop through the array and set the active state
        for (let i = 0; i < this.roadSideObjects.length; i++) {
            if (i === randomIndex) {
                this.roadSideObjects[i].active = true;
                let randomX = this.getRandomFloat(this.bounds[0], this.bounds[1]);
                let randomZ = this.getRandomFloat(this.bounds[0], this.bounds[1]);
                this.roadSideObjects[i].setPosition(new Vec3(randomX, 0, randomZ));
            } else {
                this.roadSideObjects[i].active = false
            }
        }
    }

    private getRandomFloat(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }
}


