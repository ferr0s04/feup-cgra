import { CGFobject, CGFappearance } from '../lib/CGF.js';

export class MyFireParticle {
    constructor(x, y, z, velX, velY, velZ, height) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.velX = velX;
        this.velY = velY;
        this.velZ = velZ;
        this.active = true;
        this.height = height;
    }

    update(deltaTime) {
        this.velY += 0.8 * deltaTime; // Gravity effect
        this.x += this.velX * deltaTime;
        this.y += this.velY * deltaTime;
        this.z += this.velZ * deltaTime;

        // Deactivate if too low
        if (this.y > 15) {
            this.active = false;
        }
    }
}