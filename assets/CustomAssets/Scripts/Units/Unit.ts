import { _decorator, Component, Node, Vec3, v3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass
export default class Unit extends Component {
    @property
    hp: number = 100; // Hit points

    @property
    maxHp: number = 100; // Maximum hit points

    @property
    movementSpeed: number = 5; // Movement speed

    @property
    armor: number = 0; // Armor value

    @property
    attackPower: number = 10; // Attack power

    @property
    isAlive: boolean = true; // If the unit is alive

    // Current state of the unit
    state: 'idle' | 'walking' | 'running' | 'attacking' = 'idle';

    // Handle damage taken by the unit
    takeDamage(damage: number): void {
        if (!this.isAlive) return;  // Do not take damage if dead

        const effectiveDamage = Math.max(damage - this.armor, 0);
        this.hp -= effectiveDamage;

        console.log(`Unit takes ${effectiveDamage} damage. HP: ${this.hp}/${this.maxHp}`);
        
        if (this.hp <= 0) {
            this.hp = 0;
            this.die();
        }
    }

    // Unit dies and triggers death-related actions
    die(): void {
        if (!this.isAlive) return;

        this.isAlive = false;
        this.state = 'idle';
        console.log('Unit has died!');

        // Trigger death animation or effects (you can trigger death animation or a particle effect here)
    }

    // // Unit heals over time or with healing items
    // heal(amount: number): void {
    //     if (this.isAlive) {
    //         this.hp = Math.min(this.hp + amount, this.maxHp);
    //         console.log(`Unit heals ${amount}. HP: ${this.hp}/${this.maxHp}`);
    //     }
    // }

    // // Unit idles (does nothing)
    // idle(): void {
    //     if (this.isAlive && this.state !== 'idle') {
    //         this.state = 'idle';
    //         console.log('Unit is idling...');
    //     }
    // }

    // // Unit walks (moves at normal speed)
    // walk(): void {
    //     if (this.isAlive && this.state !== 'walking') {
    //         this.state = 'walking';
    //         this.move(this.movementSpeed);
    //         console.log('Unit is walking...');
    //     }
    // }

    // // Unit runs (moves at a faster speed)
    // run(): void {
    //     if (this.isAlive && this.state !== 'running') {
    //         this.state = 'running';
    //         this.move(this.movementSpeed * 2); // Runs at double speed
    //         console.log('Unit is running...');
    //     }
    // }

    // // Move the unit with a given speed and direction (assumes forward movement for now)
    // move(speed: number, direction: Vec3 = v3(1, 0, 0)): void {
    //     if (!this.isAlive) return;  // Don't move if dead

    //     const movement = new Vec3();
    //     Vec3.scaleAndAdd(movement, this.node.position, direction, speed * 0.02); // Speed * delta time factor
    //     this.node.setPosition(movement);
    // }

    // // Unit attacks another unit
    // attack(target: Unit): void {
    //     if (this.isAlive && target.isAlive) {
    //         this.state = 'attacking';
    //         console.log(`Unit attacks target for ${this.attackPower} damage.`);
    //         target.takeDamage(this.attackPower);

    //         // Reset to idle or other state after attack is done
    //         this.state = 'idle'; // You can modify this to transition to other states as needed
    //     }
    // }

    // // Reset the unit (can be used for respawn or after a battle)
    // reset(): void {
    //     this.hp = this.maxHp;
    //     this.isAlive = true;
    //     this.state = 'idle';
    //     console.log('Unit has been reset.');
    // }
}
