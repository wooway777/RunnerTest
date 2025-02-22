import { _decorator, Component, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MoveObject')
export class MoveObject extends Component {

    @property
    speed: number = 1; // Speed of movement

    private startPos: Vec3 = new Vec3(0, 0, -1); // Starting position
    private endPos: Vec3 = new Vec3(0, 0, -11);  // End position
    private moveDirection: number = new Vec3(0, 0, -1); // 1 for moving towards endPos, -1 for moving towards startPos

    update(deltaTime: number) {
        // Calculate the position between start and end using lerp
        const currentPos = this.node.position.lerp(this.startPos, this.endPos);
        this.node.setPosition(currentPos);

        // Reverse direction when reaching either boundary
        if (this.node.position.z >= this.endPos.z || this.node.position.z <= this.startPos.z) {
            this.moveDirection *= -1; // Reverse direction
        }
    }
}
