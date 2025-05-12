import { CGFobject, CGFappearance } from '../lib/CGF.js';
import { MyOval } from './MyOval.js';
import { MyHeliBody } from './MyHeliBody.js';
import { MyLandingGear } from './MyLandingGear.js';
import { MyHeliTail } from './MyHeliTail.js';

export class MyHeli extends CGFobject {
    constructor(scene, x, y, z, velX, velY, velZ, heliportX, heliportY, heliportZ, orientationY = 0) {
        super(scene);
        this.x = x;
        this.y = y;
        this.z = z;
        this.velX = velX;
        this.velY = velY;
        this.velZ = velZ;
        this.orientationY = orientationY;
        this.lastUpdateTime = null;

        this.state = "idle"; // ['idle', 'takingOff', 'cruising', 'descending', 'landing', 'goingToHeliport']
        this.cruiseAltitude = 30;
        this.lakeX = 20; // posição do lago
        this.lakeZ = 20;
        this.heliportX = heliportX;
        this.heliportY = heliportY;
        this.heliportZ = heliportZ;
        this.bucketEmpty = true;
        this.bladeAngle = 0;

        this.heliAudio = document.getElementById("heli-sound");

        this.initElements();
    }

    initElements() {
        this.landingGear = new MyLandingGear(this.scene);
        this.body = new MyHeliBody(this.scene);
        this.tail = new MyHeliTail(this.scene);
    }

    turn(v) {
        this.orientationY += v;
    
        // Calcula a norma da velocidade atual
        const speed = Math.sqrt(this.velX**2 + this.velY**2 + this.velZ**2);
    
        // Atualiza a direção com base na nova orientação
        this.velX = speed * Math.sin(this.orientationY);
        this.velZ = speed * Math.cos(this.orientationY);
    }

    accelerate(v) {
        // Calcula a velocidade atual no plano XZ
        const speed = Math.sqrt(this.velX**2 + this.velZ**2);
        const newSpeed = Math.max(0, speed + v * 4);
    
        // Mantém a direção original baseada na orientação atual
        this.velX = newSpeed * Math.sin(this.orientationY);
        this.velZ = newSpeed * Math.cos(this.orientationY);
    }

    update(t) {
        const airborneStates = ["takingOff", "cruising", "goingToHeliport", "descending"];
        if (this.heliAudio) {
            if (airborneStates.includes(this.state)) {
                if (this.heliAudio.paused) this.heliAudio.play();
            } else {
                if (!this.heliAudio.paused) this.heliAudio.pause();
            }
        }        

        if (this.lastUpdateTime === null) {
            this.lastUpdateTime = t;
            return;
        }
    
        let dt = (t - this.lastUpdateTime) / 1000;
        this.lastUpdateTime = t;
        if (this.state !== "idle") {
            this.bladeAngle += 10 * dt;
            this.bladeAngle %= 2 * Math.PI;
        }        
    
        switch (this.state) {
            case "takingOff":
                this.y += this.velY * dt;
                if (this.y >= this.cruiseAltitude) {
                    this.y = this.cruiseAltitude;
                    this.velY = 0;
                    this.state = "cruising";
                }
                break;
    
            case "descending":
                this.y += this.velY * dt;
            
                // Gradually rotate to orientationY = 0
                if (Math.abs(this.orientationY) > 0.01) {
                    const rotationSpeed = 1.0; // radians per second
                    this.orientationY -= Math.sign(this.orientationY) * rotationSpeed * dt;
            
                    // Clamp to 0 if we're close
                    if (Math.abs(this.orientationY) < 0.01) {
                        this.orientationY = 0;
                    }
                }
            
                if (this.overLake() && this.y <= 2) {
                    this.y = 2;
                    this.velY = 0;
                    this.state = "cruising";
                } else if (this.overHeliport() && this.y <= this.heliportY) {
                    this.y = this.heliportY;
                    this.velY = 0;
                    this.state = "idle";
                }
                break;                
    
            case "goingToHeliport":
                let dx = this.heliportX - this.x;
                let dz = this.heliportZ - this.z;
                let dist = Math.sqrt(dx**2 + dz**2); // Distância horizontal no plano XZ
            
                if (dist < 0.5) {  // Quando o helicóptero chega ao destino X, Z
                    // Agora que o helicóptero chegou em X, Z, começamos a descer
                    this.velX = 0;
                    this.velZ = 0;
                    this.state = "descending";
                    this.velY = -2; // Começa a descer
                } else {
                    // Move-se horizontalmente em direção ao heliporto
                    this.velX = (dx / dist) * 5; // Movimento em X
                    this.velZ = (dz / dist) * 5; // Movimento em Z
            
                    this.x += this.velX * dt; // Atualiza a posição em X
                    this.z += this.velZ * dt; // Atualiza a posição em Z
                }
                break;
                
                
    
            default: // cruising, idle, etc.
                this.x += this.velX * dt;
                this.y += this.velY * dt;
                this.z += this.velZ * dt;
        }
    }    

    startTakeOff() {
        if (this.state === "idle" || (this.state === "descending" && this.bucketEmpty)) {
            this.state = "takingOff";
            this.velY = 3;
        }
    }
    
    startLanding() {
        if (this.bucketEmpty) {
            if (this.overLake()) {
                this.state = "descending";
                this.velX = 0;
                this.velZ = 0;
                this.velY = -2;
            } else {
                this.state = "goingToHeliport";
            }
        }
    }    

    overLake() {
        return Math.abs(this.x - this.lakeX) < 2 && Math.abs(this.z - this.lakeZ) < 2;
    }
    
    overHeliport() {
        return Math.abs(this.x - this.heliportX) < 2 && Math.abs(this.z - this.heliportZ) < 2;
    }    

    reset() {
        this.x = 0;
        this.y = 0;
        this.z = 0;
    
        this.velX = 0;
        this.velY = 0;
        this.velZ = 0;
    
        this.orientationY = 0;
    }    

    display() {
        this.scene.pushMatrix();
        this.scene.translate(this.x, this.y, this.z);
        this.scene.rotate(this.orientationY + Math.PI / 2, 0, 1, 0);
        this.scene.scale(0.75, 0.75, 0.75);
        this.landingGear.display();
        this.body.display();
        this.tail.display(this.bladeAngle);
        this.scene.popMatrix();
    }

}