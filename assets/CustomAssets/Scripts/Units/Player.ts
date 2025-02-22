import { _decorator, Component, director, Node, input, Input, EventTouch, Vec3, EventMouse, sys, screen } from 'cc';
import Unit from './Unit';
import Bullet from '../Projectiles/Bullet';

const { ccclass, property } = _decorator;

@ccclass
export default class Player extends Unit {
    @property(Node)
    shootPoint: Node = null!; // The node from which bullets will be shot

    private upper: number = 1;
    private lower: number = 1;

    // Update the player's x position based on the touch or mouse position
    handleInputMovement(): void {
        // This method will be called once per frame, so we can rely on it for moving the player
        if (sys.isMobile) {
            // Handle touch input for mobile devices
            input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        } else {
            // Handle mouse input for browsers
            input.on(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
        }
    }

    // Called on touch move
    private onTouchMove(event: EventTouch): void {
        const touchX = event.getLocationX(); // Get the touch X position in screen space

        // Normalize the touchX to range [-0.75, 0.75]
        const normalizedTouchX = this.normalizeToRange(touchX);

        const worldPos = new Vec3(normalizedTouchX, this.node.position.y, this.node.position.z);
        this.node.setPosition(worldPos); // Update player's x position based on touch position
    }

    // Called on mouse move
    private onMouseMove(event: EventMouse): void {
        const mouseX = event.getLocationX(); // Get the mouse X position in screen space

        // Normalize the mouseX to range [-0.75, 0.75]
        const normalizedMouseX = this.normalizeToRange(mouseX);

        const worldPos = new Vec3(normalizedMouseX, this.node.position.y, this.node.position.z);
        this.node.setPosition(worldPos); // Update player's x position based on mouse position
    }

    // Helper function to normalize a value to the range [-0.75, 0.75]
    private normalizeToRange(value: number): number {
        if (value > this.upper) this.upper = value;
        if (value < this.lower) this.lower = value;
        const normalizedValue = (value - this.lower) / (this.upper - this.lower) - 0.5;
        return normalizedValue * 1.5; // Scale to [-0.75, 0.75]
    }

    // Ensure we remove listeners when the player is destroyed
    onDestroy(): void {
        input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.off(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
    }

    // Start method to set up input listeners only once
    start() {
        this.handleInputMovement();
    }
}
