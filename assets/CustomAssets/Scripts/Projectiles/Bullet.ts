import { _decorator, Component, Collider, ITriggerEvent} from 'cc';
import Projectile from './Projectile';
import Enemy from '../Units/Enemy';
const { ccclass, property } = _decorator;

@ccclass('Bullet')
export default class Bullet extends Projectile {

    @property
    override damage: number = 10; // Damage dealt by the projectile

    @property
    override lifetime: number = 5; // Lifetime in seconds before the projectile disappears

    start() {
        // Get the Collider component attached to this node
        const collider = this.getComponent(Collider);
        if (collider) {
            // Register the collision callback
            collider.on('onCollisionEnter', this.onCollisionEnter, this);
        }
    }

    onCollisionEnter(event: ITriggerEvent) {
        // // Get the name of the object this script is attached to
        // const thisObjectName = this.node.name;

        // // Get the name of the other object involved in the collision
        // const otherObjectName = event.otherCollider.node.name;

        // // Print the names of both objects
        // console.log(`Bullet Collision detected between: ${thisObjectName} and ${otherObjectName}`);
        super.onCollisionEnter(event);

        const enemy = event.otherCollider.node.getComponent(Enemy);
        if (enemy) {
            // Deal damage to the enemy
            enemy.takeDamage(this.damage);
            console.log(`Dealt ${this.damage} damage to enemy.`);
        }

        this.destroyProjectile();
    }

    // Destroy the projectile
    destroyProjectile(): void {
        this.node.destroy();
    }
}