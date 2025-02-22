import { _decorator, Component, Node, Vec3, director, Quat, SkeletalAnimation, AnimationState, randomRangeInt } from 'cc';
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
    }

    update(dt: number): void {
        if (!this.isAlive || !this.player) return;

        const playerPos = this.player.node.worldPosition;
        const enemyPos = this.node.worldPosition;
        const distanceToPlayer = Vec3.distance(enemyPos, playerPos);

        if (distanceToPlayer <= this.attackRange) {
            this.attackPlayer(playerPos);
        } else if (distanceToPlayer <= this.detectionRange) {
            this.moveTowards(playerPos, dt);
        } else {
            this.moveForward(dt);
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
            this.anim.play(clipName);
        }
    }

    private onAnimationFinished(event: AnimationState): void {
        if (event.name.startsWith("attack")) {
            this.isAttacking = false; // Allow attacking again after animation finishes
        } else if (event.name === "run") {
            this.isRunning = false; // Allow run to restart if needed
        } else if (event.name === 'die') {
            // After the death animation finishes, destroy the enemy
            this.node.destroy();
        }
    }

    takeDamage(damage: number): void {
        const effectiveDamage = Math.max(damage - this.armor, 0);
        this.hp -= effectiveDamage;

        if (this.hp <= 0) {
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
    }
}
