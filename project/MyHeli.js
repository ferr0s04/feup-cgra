import { CGFobject, CGFappearance } from '../lib/CGF.js';
import { MyHeliBody } from './MyHeliBody.js';
import { MyFullLandingGear } from './MyFullLandingGear.js';
import { MyHeliTail } from './MyHeliTail.js';
import { MyHeliBucket } from './MyHeliBucket.js';

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
        this.lakeArea = {
            centerX: 70,
            centerZ: -10,
            width: 70,
            height: 70,
            // These define the actual lake shape within the square
            validAreas: [
                { x1: 45, z1: -35, x2: 95, z2: -25 },  // Bottom wide part
                { x1: 55, z1: -25, x2: 85, z2: 15 }    // Upper narrow part
            ]
        };
        this.heliportX = heliportX;
        this.heliportY = heliportY;
        this.heliportZ = heliportZ;
        this.bucketDisplayed = false;
        this.bucketEmpty = true;
        this.bladeAngle = 0;
        this.tiltAngle = 0;
        this.dropRequested = false;
        this.fillingBucket = false;
        this.fillingStartTime = 0;
        this.fillingDuration = 2000;
        this.bucketDropTime = 0;

        this.heliAudio = document.getElementById("heli-sound");

        this.initElements();
    }

    initElements() {
        this.fullLanding = new MyFullLandingGear(this.scene);
        this.body = new MyHeliBody(this.scene);
        this.tail = new MyHeliTail(this.scene);
        this.bucket = new MyHeliBucket(this.scene);
    }

    turn(v) {
        this.orientationY += v;
    
        // Calcula a norma da velocidade atual no plano XZ
        const speed = Math.sqrt(this.velX**2 + this.velZ**2);
        
        if (speed > 0) {
            // Atualiza a direção com base na nova orientação
            this.velX = speed * Math.sin(this.orientationY);
            this.velZ = speed * Math.cos(this.orientationY);
        }
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
                    if (Math.abs(this.orientationY) < 0.01) {
                        this.orientationY = 0;
                    }
                }

                if (this.overLake() && this.y-0.8 <= 4) {
                    this.y = 4.8;
                    this.velY = 0;
                    this.state = "overLake";
                    this.bucketDisplayed = true;
                    // Start filling automatically if bucket is empty and not already filling
                    if (this.bucketEmpty && !this.fillingBucket) {
                        this.fillingBucket = true;
                        this.fillingStartTime = t;
                    }
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

        if (this.state === "cruising" && !this.bucketEmpty && this.dropRequested) {
            const fires = this.scene.forest.fires;
            let overFire = false;

            for (const fire of fires) {
                const dx = fire.x - this.x + this.scene.forest.forestX;
                const dz = fire.z - this.z + this.scene.forest.forestZ;
                const distance = Math.sqrt(dx * dx + dz * dz);

                if (distance < 5) {  // If very close to a fire
                    overFire = true;
                    break;
                }
            }

            if (overFire) {
                this.bucket.startDropping(t);
                this.bucketEmpty = true;
                this.bucketDropTime = t + this.bucket.dropDuration;
            }
            this.dropRequested = false; // Reset flag regardless
        }

        if (this.fillingBucket) {
            if (t - this.fillingStartTime >= this.fillingDuration) {
                this.fillingBucket = false;
                this.bucketEmpty = false; // Bucket is now full
                this.state = "ascending";
                this.velY = 3; // Start going up
            }
            // While filling, don't allow movement
            return;
        }

        // Add a new ascending state
        if (this.state === "ascending") {
            this.y += this.velY * dt;
            if (this.y >= this.cruiseAltitude) {
                this.y = this.cruiseAltitude;
                this.velY = 0;
                this.state = "cruising";
            }
        }

        // Update bucket and particles
        if (this.bucket) {
            this.bucket.update(t);
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

    startFilling(t) {
        if (this.state === "overLake" && this.overLake() && this.bucketEmpty) {
            this.fillingBucket = true;
            this.fillingStartTime = t;
        }
    }

    overLake() {
        // Check if point is within any of the valid lake areas
        for (const area of this.lakeArea.validAreas) {
            if (this.x >= area.x1 && this.x <= area.x2 && 
                this.z >= area.z1 && this.z <= area.z2) {
                return true;
            }
        }
        return false;
    }
    
    overHeliport() {
        return Math.abs(this.x - this.heliportX) < 2 && Math.abs(this.z - this.heliportZ) < 2;
    }    

    reset() {
        this.x = this.heliportX;
        this.y = this.heliportY;
        this.z = this.heliportZ;
    
        this.velX = 0;
        this.velY = 0;
        this.velZ = 0;
    
        this.orientationY = 0;

        this.state = "idle";
    }

    setTilt(forward) {
        const maxTilt = Math.PI / 18;
        const tiltSpeed = Math.PI / 72;

        if (forward === true) {
            this.tiltAngle = Math.min(this.tiltAngle + tiltSpeed, maxTilt);
        } else if (forward === false) {
            this.tiltAngle = Math.max(this.tiltAngle - tiltSpeed, -maxTilt);
        } else {
            // Volta gradualmente ao zero
            if (this.tiltAngle > 0) {
                this.tiltAngle = Math.max(0, this.tiltAngle - tiltSpeed);
            } else if (this.tiltAngle < 0) {
                this.tiltAngle = Math.min(0, this.tiltAngle + tiltSpeed);
            }
        }
    }

    display() {
        this.scene.pushMatrix();
        this.scene.translate(this.x, this.y-0.2, this.z - 4.5);
        this.scene.rotate(this.orientationY + Math.PI / 2, 0, 1, 0);
        this.scene.rotate(this.tiltAngle, 0, 0, 1);
        this.scene.scale(0.75, 0.75, 0.75);
        this.body.display();
        this.tail.display(this.bladeAngle);
        this.fullLanding.display();
        const now = Date.now();
        if (
            this.overLake() ||
            !this.bucketEmpty ||
            (this.bucketDropTime && now < this.bucketDropTime)
        ) {
            this.bucket.display();
        }
        this.scene.popMatrix();
    }
}