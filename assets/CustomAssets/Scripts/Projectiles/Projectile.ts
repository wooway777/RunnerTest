import { _decorator, Component, Collider, ITriggerEvent} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Projectile')
export default class Projectile extends Component {

    @property
    damage: number = 50; // Damage dealt by the projectile

    @property
    lifetime: number = 5; // Lifetime in seconds before the projectile disappears

    private timer: number = 0;

    start() {
        // Get the Collider component attached to this node
        const collider = this.getComponent(Collider);
        if (collider) {
            // Register the collision callback
            collider.on('onCollisionEnter', this.onCollisionEnter, this);
        }
    }

    // Update method for projectile movement
    update(dt: number) {
        this.timer += dt;
        if (this.timer > this.lifetime) {
            this.destroyProjectile();
        }
    }

    onCollisionEnter(event: ITriggerEvent) {
        // // Get the name of the object this script is attached to
        // const thisObjectName = this.node.name;

        // // Get the name of the other object involved in the collision
        // const otherObjectName = event.otherCollider.node.name;

        // // Print the names of both objects
        // console.log(`Projectile Collision detected between: ${thisObjectName} and ${otherObjectName}`);
    }

    // Destroy the projectile
    destroyProjectile(): void {
        this.node.destroy();
    }
}