// Shooter.ts
import { _decorator, Component, Node, Prefab, instantiate, Vec3, systemEvent, SystemEvent, EventKeyboard, KeyCode, director, RigidBody } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Shooter')
export class Shooter extends Component {

    @property(Prefab)
    public projectilePrefab: Prefab | null = null;  // The projectile prefab

    @property(Node)
    public shootPoint: Node | null = null;  // The point from where the projectiles are shot

    @property
    public interval: number = 1.0;  // The interval at which projectiles are shot (in seconds)

    @property
    public speed: number = 10.0;  // The speed of the projectile (adjustable)

    private lastShotTime: number = 0;  // Time tracker for when the last shot occurred

    start() {
        // Optionally, you can bind an event to shoot (e.g., a keyboard input)
        systemEvent.on(SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    update(deltaTime: number) {
        // Check if it's time to shoot based on interval
        this.lastShotTime += deltaTime;
        if (this.lastShotTime >= this.interval) {
            this.shoot();
            this.lastShotTime = 0;  // Reset the timer
        }
    }

    shoot() {
        if (!this.projectilePrefab || !this.shootPoint) {
            console.warn('Projectile prefab or shoot point is not assigned!');
            return;
        }

        // Create a new projectile from the prefab
        const projectile = instantiate(this.projectilePrefab);

        // Get the world position of the shoot point
        const shootPointWorldPos = this.shootPoint.worldPosition;

        // Set the projectile's position to the world position of the shoot point
        projectile.setPosition(shootPointWorldPos);

        // Add the projectile to the scene
        director.getScene().addChild(projectile);

        // Delay the velocity application until the next frame to ensure RigidBody is initialized
        this.scheduleOnce(() => {
            // Calculate the direction (towards the front of the shooter)
            const direction = this.node.forward;  // Forward direction of the shooter (based on its local orientation)

            // Apply velocity to the projectile (adjustable speed)
            const rigidBody = projectile.getComponent(RigidBody);
            if (rigidBody) {
                rigidBody.setLinearVelocity(direction.multiplyScalar(this.speed));  // Set velocity using setLinearVelocity
            }
        }, 0);
    }

    // Optional: Trigger shooting by pressing a key (e.g., Space bar)
    onKeyDown(event: EventKeyboard) {
        if (event.keyCode === KeyCode.SPACE) {
            this.shoot();
        }
    }

    // Optionally clean up when the component is destroyed
    onDestroy() {
        systemEvent.off(SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    }
}
