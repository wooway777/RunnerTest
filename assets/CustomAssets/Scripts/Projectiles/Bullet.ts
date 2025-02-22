import { _decorator, Component, Collider, RigidBody, PhysicsSystem } from 'cc';
import Projectile from './Projectile';
import Unit from '../Units/Unit';

const { ccclass, property } = _decorator;

@ccclass
export default class Bullet extends Projectile {
    @property
    override damage: number = 10; // Overriding inherited damage property

    private rigidbody: RigidBody | null = null;

    constructor(rigidBody: RigidBody) {
        super();
        this.rigidbody = rigidBody;
    }

    start() {
        this.rigidbody = this.node.getComponent(RigidBody);

        if (this.rigidbody) {
            // If the collision detection property is unavailable, adjust the behavior directly
            const physicsSystem = PhysicsSystem.instance;

            if (physicsSystem) {
                console.log("Using default physics system for collision detection.");
                // Attempt to set up the continuous collision detection here
                // You might also try adjusting other physics properties for performance
            } else {
                console.error("PhysicsSystem not found!");
            }
        } else {
            console.error("RigidBody component not found on Bullet!");
        }
    }

    update(dt: number): void {
        super.update(dt);
    }

    onCollisionEnter(other: Collider, self: Collider) {
        console.log("Collision detected between", self.node.name, "and", other.node.name);
        if (other.node) {
            console.log('Projectile hit:', other.node.name);
            other.node.getComponent(Unit)?.takeDamage(this.damage);
        }
        this.destroyProjectile();
    }

    destroyProjectile() {
        this.node.destroy();
    }

    private checkCollisionDetection() {
        if (this.rigidbody) {
            // If collisionDetection is not available, log other information
            console.log("RigidBody:", this.rigidbody);
        } else {
            console.log("RigidBody is not assigned!");
        }
    }
}

