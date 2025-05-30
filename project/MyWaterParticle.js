import { CGFobject, CGFappearance } from '../lib/CGF.js';

export class MyWaterParticle {
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
        this.velY -= 9.8 * deltaTime;
        this.x += this.velX * deltaTime;
        this.y += this.velY * deltaTime;
        this.z += this.velZ * deltaTime;

        if (this.y < -40) {
            this.active = false;
        }
    }
}