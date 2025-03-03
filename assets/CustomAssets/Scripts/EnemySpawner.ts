import { _decorator, Component, Node, Prefab, instantiate, Vec3, randomRange, randomRangeInt, director } from 'cc';
import Enemy from './Units/Enemy';

const { ccclass, property } = _decorator;

@ccclass('EnemySpawner')
export default class EnemySpawner extends Component {
    @property(Prefab)
    enemyPrefab: Prefab = null!; // The Enemy prefab to spawn

    @property
    spawnFrequencyMin: number = 2; // Minimum time between spawns (in seconds)

    @property
    spawnFrequencyMax: number = 5; // Maximum time between spawns (in seconds)

    @property
    avoidanceRadiusMultiplier: number = 0.5; // Multiplier for avoidanceRadius based on scaling

    private spawnTimer: number = 0;

    start() {
        this.scheduleNextSpawn();
    }

    update(dt: number) {
        this.spawnTimer -= dt;
        if (this.spawnTimer <= 0) {
            this.spawnEnemy();
            this.scheduleNextSpawn();
        }
    }

    private scheduleNextSpawn(): void {
        // Randomize the next spawn time within the frequency range
        this.spawnTimer = randomRange(this.spawnFrequencyMin, this.spawnFrequencyMax);
    }

    private spawnEnemy(): void {
        if (!this.enemyPrefab) {
            console.error("Enemy prefab is not assigned!");
            return;
        }

        // Instantiate the enemy prefab
        const enemyNode = instantiate(this.enemyPrefab);
        if (!enemyNode) {
            console.error("Failed to instantiate enemy prefab!");
            return;
        }

        // Set random position
        const spawnPosition = new Vec3(
            randomRange(-0.6, 0.6), // Random x between -0.6 and 0.6
            0, // y is always 0
            randomRange(-20, -40) // Random z between -20 and -40
        );
        enemyNode.setPosition(spawnPosition);

        // Randomize scaling (x, y, z between 0.8 and 1.2, with x = z)
        const scale = randomRange(0.8, 1.2);
        enemyNode.setScale(new Vec3(scale, randomRange(0.8, 1.2), scale));

        // Set avoidanceRadius based on scaling
        const enemy = enemyNode.getComponent(Enemy);
        if (enemy) {
            enemy.setAvoidanceRadius(scale * this.avoidanceRadiusMultiplier);
        } else {
            console.error("Enemy component not found on the spawned enemy!");
        }

        // Add the enemy to the scene
        director.getScene()?.addChild(enemyNode);
    }
}