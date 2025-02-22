import { _decorator, Collider, Component, Node, v2, v3, Vec2, Vec3 } from 'cc';
import Unit from '../Units/Unit';
// Projectile.ts
const { ccclass, property } = _decorator;

// Projectile.ts
@ccclass
export default class Projectile extends Component {
    @property
    speed: number = 10; // Speed of the projectile

    @property
    damage: number = 50; // Damage dealt by the projectile

    @property
    direction: Vec3 = v3(1, 0, 0); // Direction of the projectile (default to right in 3D)

    @property
    lifetime: number = 5; // Lifetime in seconds before the projectile disappears

    private timer: number = 0;

    // Update method for projectile movement
    update(dt: number) {
        this.timer += dt;
        if (this.timer > this.lifetime) {
            this.destroyProjectile();
        } else {
            // Move the projectile by its direction multiplied by speed and delta time
            this.node.setPosition(this.node.position.add(this.direction.multiplyScalar(this.speed * dt)));
        }
    }

    // Handle collision or impact with other objects
    onCollisionEnter(other: Collider, self: Collider) {
        console.log('Collision detected');
        // Deal damage or trigger other effects
        if (other.node) {
            console.log('Projectile hit:', other.node.name);
            other.node.getComponent(Unit)?.takeDamage(this.damage);
        }
        this.destroyProjectile();
    }

    // Destroy the projectile
    destroyProjectile(): void {
        this.node.destroy();
    }
}




