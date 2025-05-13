import { CGFscene, CGFcamera, CGFaxis, CGFappearance, CGFtexture } from "../lib/CGF.js";
import { MyPlane } from "./MyPlane.js";
import { MyPanorama } from "./MyPanorama.js";
import { MyBuilding } from "./MyBuilding.js";
import { MyForest } from "./MyForest.js";
import { MyLandingGear } from "./MyLandingGear.js";
import { MyHeli } from "./MyHeli.js";

/**
 * MyScene
 * @constructor
 */
export class MyScene extends CGFscene {
  constructor() {
    super();
    this.heliSound = document.getElementById("heli-sound");
  }

  init(application) {
    super.init(application);

    this.initCameras();
    this.initLights();

    // Background color
    this.gl.clearColor(1, 1, 1, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

    this.enableTextures(true);
    this.setUpdatePeriod(50);

    // Initialize scene objects
    this.axis = new CGFaxis(this, 20, 1);
    this.plane = new MyPlane(this, 64, 0, 20, 0, 20);
    this.panorama = new MyPanorama(this);  

    this.windowTexture = new CGFappearance(this);
    this.windowTexture.loadTexture("textures/window1.jpg");
    this.windowTexture.setDiffuse(0.9, 0.9, 0.9, 1);
    this.windowTexture.setSpecular(0.1, 0.1, 0.1, 1);
    this.windowTexture.setShininess(10);

    this.grassTexture = new CGFappearance(this);
    this.grassTexture.loadTexture("textures/grass.jpg");
    this.grassTexture.setDiffuse(0.9, 0.9, 0.9, 1);
    this.grassTexture.setSpecular(0.1, 0.1, 0.1, 1);
    this.grassTexture.setShininess(10);
    this.grassTexture.setTextureWrap("REPEAT", "REPEAT");

    let totalBuildingWidth = 30;
    this.building = new MyBuilding(this, totalBuildingWidth, 5, 3, this.windowTexture, [0.8, 0.6, 0.3]);
    this.building.centralWidth = totalBuildingWidth/3;

    this.speedFactor = 1.0;
    
    this.heli = new MyHeli(this,
      -this.building.centralWidth + this.building.totalWidth / 6 - 1.5,
      this.building.centralFloors * 2.5,
      -50 + this.building.depth - 1.5,
      0, 0, 0,
      -this.building.centralWidth + this.building.totalWidth / 6 - 1.5,
      this.building.centralFloors * 2.5,
      -50 + this.building.depth - 1.5);
  

    //this.forest = new MyForest(this, 1, 1, 30, 30, true); // Floresta com 1 árvore de teste
    this.forest = new MyForest(this, 7, 8, 55, 55, true, 20); // normal - 3 variedades
    //this.forest = new MyForest(this, 20, 20, 200, 200, true, 60); // huge forest
    //this.forest = new MyForest(this, 3, 4, 40, 40, true, 2); // less variety

    this.landing = new MyLandingGear(this);
  }

  initLights() {
    this.lights[0].setPosition(20, 20, 20, 1);
    this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.lights[0].enable();
    this.lights[0].update();
  }

  initCameras() {
    this.camera = new CGFcamera(
      1,
      0.1,
      1000,
      vec3.fromValues(25, 25, 25),
      vec3.fromValues(0, 0, 0)
    );
  }

  checkKeys() {
    let keysPressed = false;
  
    if (this.gui.isKeyPressed("KeyW")) {
      this.heli.setTilt(true);
    }
    else if (this.gui.isKeyPressed("KeyS")) {
      this.heli.setTilt(false);
    }
    else {
      this.heli.setTilt(null);
    }

    if (this.heli.state !== "idle") {
      if (this.gui.isKeyPressed("KeyD")) {
        this.heli.turn(-0.05 * this.speedFactor);
        keysPressed = true;
      }

      if (this.gui.isKeyPressed("KeyA")) {
          this.heli.turn(0.05 * this.speedFactor);
          keysPressed = true;
      }

      if (this.gui.isKeyPressed("KeyW")) {
          this.heli.accelerate(0.01 * this.speedFactor);
          keysPressed = true;
      }

      if (this.gui.isKeyPressed("KeyS")) {
          this.heli.accelerate(-0.01 * this.speedFactor);
          keysPressed = true;
      }

      if (this.gui.isKeyPressed("KeyR")) {
        this.heli.reset();
        console.log("Eagle has returned to base.");
      }

          
      if (this.gui.isKeyPressed("KeyL")) {
          this.heli.startLanding();
      }
    }

    if (this.gui.isKeyPressed("KeyP")) {
      this.heli.startTakeOff();
    }
  
    //if (keysPressed)
      //console.log(`Pos: (${this.heli.x.toFixed(2)}, ${this.heli.y.toFixed(2)}, ${this.heli.z.toFixed(2)}) | Vel: (${this.heli.velX.toFixed(2)}, ${this.heli.velY.toFixed(2)}, ${this.heli.velZ.toFixed(2)})`);
  }
  
  update(t) {
    this.checkKeys();
    this.heli.update(t);
  }  

  setDefaultAppearance() {
    this.setAmbient(0.5, 0.5, 0.5, 1.0);
    this.setDiffuse(0.5, 0.5, 0.5, 1.0);
    this.setSpecular(0.5, 0.5, 0.5, 1.0);
    this.setShininess(10.0);
  }

  async loadTexture(texturePath) {
    const texture = new CGFtexture(this, texturePath);
    return texture;
  }

  display() {
    // ---- BEGIN Background, camera and axis setup
    // Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    // Initialize Model-View matrix as identity (no transformation)
    this.updateProjectionMatrix();
    this.loadIdentity();
    // Apply transformations corresponding to the camera position relative to the origin
    this.applyViewMatrix();

    // Draw axis
    //this.axis.display();

    this.setDefaultAppearance();
    
    //if (this.panorama) this.panorama.display();    

    this.grassTexture.apply();
    this.pushMatrix();
    this.scale(100, 100, 100);
    this.rotate(-90 * Math.PI / 180, 1, 0, 0);
    this.plane.display();
    this.popMatrix();

    // Make the building appear in the default position
    if (this.building) {
      this.pushMatrix();
      this.translate(-this.building.centralWidth, 0, -50);
      this.building.display();
      this.popMatrix();
    }

    //if (this.forest) this.forest.display();

    if (this.heli) {
      this.pushMatrix();
      //this.translate(-this.building.centralWidth + this.building.totalWidth / 6 - 2, this.building.centralFloors * 2.5, -50 + this.building.depth - 2);
      this.heli.display();
      this.popMatrix();
    }
    if (this.landing) this.landing.display();

  }
}
