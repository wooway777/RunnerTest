import { _decorator, Component, Node, Vec3 } from 'cc';
import { ObjectController } from './ObjectController'; // Assuming this is the path to ObjectController

const { ccclass, property } = _decorator;

@ccclass('RoadRunner')
export class RoadRunner extends Component {

    @property([Node])
    roadPieces: Node[] = [];

    @property
    speed = 1; // Speed at which the road pieces move

    @property
    boundary = 7; // Boundary to reset the road piece

    private resetPosition: Vec3;

    start() {
        let n = this.roadPieces.length;
        // Initialize the reset position based on the last road piece's position
        this.resetPosition = this.roadPieces[n - 1].position.clone();
    }

    update(deltaTime: number) {
        // Loop through each road piece and move it along the z-axis
        for (let i = 0; i < this.roadPieces.length; ++i) {
            const roadPiece = this.roadPieces[i];
            const currentPos = roadPiece.position;
            const newZ = currentPos.z + this.speed * deltaTime;

            // Update the road piece's position
            roadPiece.setPosition(currentPos.x, currentPos.y, newZ);

            // If the road piece moves beyond the boundary, reset its position
            if (newZ > this.boundary) {
                roadPiece.setPosition(this.resetPosition.x, this.resetPosition.y, this.resetPosition.z);

                // Call randomizeObject() on all children (which are considered "grandchildren")
                this.randomizeChildren(roadPiece);
            }
        }
    }

    // Function to iterate through all the children of a road piece and call randomizeObject
    randomizeChildren(roadPiece: Node) {
        // Get all children (grandchildren of roadPieces)
        const children = roadPiece.children;

        // Iterate over each child (which is considered a "grandchild")
        children.forEach(child => {
            // Check if the child has the ObjectController component
            const objectController = child.getComponent(ObjectController);
            if (objectController) {
                // Call randomizeObject() if the component exists
                objectController.randomizeObject();
            }
        });
    }
}
