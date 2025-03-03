import { _decorator, Component, Node, Vec3, director, Quat, SkeletalAnimation, AnimationState, randomRangeInt, Collider, PhysicsSystem, PhysicsRayResult, ITriggerEvent } from 'cc';
import Unit from './Unit';
import Player from './Player';

const { ccclass, property } = _decorator;

@ccclass('Enemy')
export default class Enemy extends Unit {
    @property
    moveSpeed: number = 1.5; // Movement speed

    @property
    detectionRange: number = 5; // Detection range

    @property
    attackRange: number = 1.5; // Attack range

    @property(Node)
    modelNode: Node = null!; // The child node with the SkeletalAnimation component

    private player: Player | null = null;
    private direction: Vec3 = new Vec3(0, 0, 1); // Default move direction
    private anim: SkeletalAnimation | null = null;

    private isAttacking: boolean = false;
    private isRunning: boolean = false;
    private isAvoiding: boolean = false; // Flag to track if the enemy is avoiding

    private canMove: boolean = true;
    private avoidanceRadius = 0.5;

    start() {
        // Find the player
        const scene = director.getScene();
        if (scene) {
            this.player = scene.getComponentInChildren(Player);
        }

        // Get the SkeletalAnimation component from the modelNode
        if (this.modelNode) {
            this.anim = this.modelNode.getComponent(SkeletalAnimation);
            this.anim.on(SkeletalAnimation.EventType.FINISHED, this.onAnimationFinished, this);
        }

        const collider = this.getComponent(Collider);
        if (collider) {
            // Register the collision callback
            collider.on('onCollisionEnter', this.onCollisionEnter, this);
        }
    }

    update(dt: number): void {
        if (!this.player) return;

        if (!this.isAlive) {
            const movement = new Vec3();
            Vec3.scaleAndAdd(movement, this.node.worldPosition, this.direction, 1 * dt);
            this.node.setWorldPosition(movement);
            
            return;
        }

        // Avoid overlapping with other enemies
        this.avoidOtherEnemies(dt);

        // Skip movement logic if avoiding
        if (this.isAvoiding) return;

        const playerPos = this.player.node.worldPosition;
        const enemyPos = this.node.worldPosition;
        const distanceToPlayer = Vec3.distance(enemyPos, playerPos);

        if (distanceToPlayer <= this.attackRange) {
            this.attackPlayer(playerPos);
        } else if (this.canMove && distanceToPlayer <= this.detectionRange) {
            this.moveTowards(playerPos, dt);
        } else if (this.canMove) {
            this.moveForward(dt);
        }
    }

    // onCollisionStay(event: ITriggerEvent) {
    //     // Get the name of the object this script is attached to
    //     const thisObjectName = this.node.name;
    
    //     // Get the name of the other object involved in the collision
    //     const otherObjectName = event.otherCollider.node.name;

    //     console.log("Enemy collision staying: " + thisObjectName + " and " + otherObjectName);
    
    //     const enemy = event.otherCollider.node.getComponent(Enemy);
    //     if (enemy) {
    //         let v1: Vec3 = event.otherCollider.node.worldPosition.subtract(this.node.worldPosition);
    //         let v2: Vec3 = this.player.node.worldPosition.subtract(this.node.worldPosition);
    //         if (Vec3.dot(v1, v2) > 0) this.canMove = false
    //         else this.canMove = true;
    //     }
    // }

    private avoidOtherEnemies(dt: number): void {
        const scene = director.getScene();
        if (!scene) return;

        const enemies = scene.getComponentsInChildren(Enemy);

        this.isAvoiding = false; // Reset the flag

        for (const otherEnemy of enemies) {
            if (otherEnemy === this) continue; // Skip self

            const distance = Vec3.distance(this.node.worldPosition, otherEnemy.node.worldPosition);
            if (distance < this.avoidanceRadius) {
                this.isAvoiding = true; // Set the flag to true

                const directionAway = new Vec3();
                Vec3.subtract(directionAway, this.node.worldPosition, otherEnemy.node.worldPosition);
                directionAway.normalize();

                const movement = new Vec3();
                Vec3.scaleAndAdd(movement, this.node.worldPosition, directionAway, this.moveSpeed * dt);
                this.node.setWorldPosition(movement);

                this.faceDirection(directionAway);
                this.playAnimation("run");
            }
        }
    }

    private moveForward(dt: number): void {
        const movement = new Vec3();
        Vec3.scaleAndAdd(movement, this.node.worldPosition, this.direction, this.moveSpeed * dt);
        this.node.setWorldPosition(movement);
        
        this.faceDirection(this.direction);
        this.playAnimation("run");
    }

    private moveTowards(target: Vec3, dt: number): void {
        const directionToPlayer = new Vec3();
        Vec3.subtract(directionToPlayer, target, this.node.worldPosition);
        directionToPlayer.normalize();

        const movement = new Vec3();
        Vec3.scaleAndAdd(movement, this.node.worldPosition, directionToPlayer, this.moveSpeed * dt);
        this.node.setWorldPosition(movement);

        this.faceDirection(directionToPlayer);
        this.playAnimation("run");
        this.isAttacking = false;
    }

    private attackPlayer(playerPos: Vec3): void {
        const directionToPlayer = new Vec3();
        Vec3.subtract(directionToPlayer, playerPos, this.node.worldPosition);
        directionToPlayer.normalize();
        this.faceDirection(directionToPlayer);

        if (this.isAttacking) return; // Don't start a new attack until the previous one finishes
        this.isAttacking = true;

        console.log("Enemy attacks the player!");

        // Randomly choose between attack1 and attack2
        const attackAnim = randomRangeInt(0, 2) === 0 ? "attack1" : "attack2";
        this.playAnimation(attackAnim);
    }

    private faceDirection(direction: Vec3): void {
        if (!direction.equals(Vec3.ZERO)) {
            const lookRotation = new Quat();
            Quat.fromViewUp(lookRotation, direction, Vec3.UP);
            this.node.setRotation(lookRotation);
        }
    }

    private playAnimation(clipName: string): void {
        if (this.anim && this.anim.getState(clipName)?.isPlaying === false) {
            // if (clipName.startsWith("attack")) 
            if (clipName == "hit") {
                if (this.anim.getState("attack1")?.isPlaying || 
                this.anim.getState("attack2")?.isPlaying) return;
            }
            if (clipName == 'run') {
                if (this.anim.getState("hit")?.isPlaying) return;
            }

            this.anim.play(clipName);
        }
    }

    private onAnimationFinished(type: string, state: AnimationState): void {
        if (!state || !state.name) {
            console.error("Animation state or name is undefined!");
            return;
        }

        this.isAttacking = false;
    
        const clipName = state.name;
    
        if (clipName === "die") {
            setTimeout(() => {
                if (this.node && this.node.isValid) {
                    console.log("Destroying node now.");
                    this.node.destroy();
                }
            }, 1500); // 1000ms = 1 seconds
        }
    }

    takeDamage(damage: number): void {
        if (!this.isAlive) return; // Ignore damage if already dead
    
        const effectiveDamage = Math.max(damage - this.armor, 0);
        this.hp -= effectiveDamage;
    
        // Play hit animation if still alive
        if (this.hp > 0) {
            this.playAnimation("hit");
        } else {
            this.hp = 0;
            this.die();
        }
    }

    die(): void {
        if (!this.isAlive) return;

        this.isAlive = false;
        this.state = 'idle';
        console.log('Enemy has died!');
        
        // Ensure the die animation plays, if not already playing
        if (this.anim && !this.anim.getState('die')?.isPlaying) {
            this.anim.play('die'); // Play the "die" animation
        }

        // Deactivate the collider to prevent further collision detection
        const collider = this.node.getComponent(Collider);
        if (collider) {
            collider.enabled = false;
        }
    }

    public setAvoidanceRadius(radius: number) {
        this.avoidanceRadius = radius;
    }
}
