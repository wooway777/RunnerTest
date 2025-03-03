import { _decorator, Component, Collider, ITriggerEvent, log } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CollisionLogger3D')
export class CollisionLogger3D extends Component {

    start() {
        // Print a log when the start method is called
        log('Game started!');

        // Get the Collider component attached to this node
        const collider = this.getComponent(Collider);
        if (collider) {
            // Register the collision callback
            collider.on('onCollisionEnter', this.onCollisionEnter, this);
        }
    }

    onCollisionEnter(event: ITriggerEvent) {
        // Get the name of the object this script is attached to
        const thisObjectName = this.node.name;

        // Get the name of the other object involved in the collision
        const otherObjectName = event.otherCollider.node.name;

        // Print the names of both objects
        log(`Collision detected between: ${thisObjectName} and ${otherObjectName}`);
    }
}