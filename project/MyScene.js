import { CGFscene, CGFcamera, CGFaxis, CGFappearance, CGFtexture, CGFshader } from "../lib/CGF.js";
import { MyPlane } from "./MyPlane.js";
import { MyPanorama } from "./MyPanorama.js";
import { MyBuilding } from "./MyBuilding.js";
import { MyForest } from "./MyForest.js";
import { MyHeli } from "./MyHeli.js";
import { MyLake } from "./MyLake.js";


/**
 * MyScene
 * @constructor
 */
export class MyScene extends CGFscene {
  constructor() {
    super();
    this.heliSound = document.getElementById("heli-sound");
    this.heliPOV = false;
    this.isNight = false;
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

    // Building position
    this.buildingX = -this.building.centralWidth;
    this.buildingZ = -50;

    this.speedFactor = 1.0;
    
    this.heli = new MyHeli(this,
      this.buildingX + this.building.totalWidth / 6,
      this.building.centralFloors * 2.5 + 0.8,
      this.buildingZ + this.building.depth / 2 + 4,
      0, 0, 0,
      this.buildingX + this.building.totalWidth / 6,
      this.building.centralFloors * 2.5 + 0.8,
      this.buildingZ + this.building.depth / 2 + 4);

    this.getLakePoints();
  
    this.forest = new MyForest(this, 6, 13, 120, 50, true, 20);

    this.waterAppearance = new CGFappearance(this);
    this.waterAppearance.setAmbient(0.3, 0.3, 0.3, 1);
    this.waterAppearance.setDiffuse(0.7, 0.7, 0.7, 1);
    this.waterAppearance.setSpecular(0.0, 0.0, 0.0, 1);

    this.textureWater = new CGFtexture(this, "textures/waterTex.jpg");
    this.textureMask = new CGFtexture(this, "textures/lake_mask.png");
    this.waterAppearance.setTexture(this.textureWater);
    this.waterAppearance.setTextureWrap('REPEAT', 'REPEAT');
    this.waterShader = new CGFshader(this.gl, "shaders/water.vert", "shaders/water.frag");
    this.waterShader.setUniformsValues({ uSampler: 0, uSampler2: 1, uMask: 2, normScale: 16.0, timeFactor: 0, uBrightness: 1.0 });

    this.lake = new MyLake(this, 200);
  }

  initLights() {
    this.lights[0].setPosition(0, 100, 0, 1);
    this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.lights[0].setSpecular(0.0, 0.0, 0.0, 1.0);
    this.lights[0].enable();
    this.lights[0].update();
  }

  initCameras() {
    this.camera = new CGFcamera(
      1,
      0.1,
      1000,
      vec3.fromValues(-35, 35, -70),
      vec3.fromValues(0, 0, 0)
    );
  }

  checkKeys() {
    let keysPressed = false;
  
    // Control helicopter tilt
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
      // D -> Turn right
      if (this.gui.isKeyPressed("KeyD")) {
        this.heli.turn(-0.05 * this.speedFactor);
        keysPressed = true;
      }

      // A -> Turn left
      if (this.gui.isKeyPressed("KeyA")) {
          this.heli.turn(0.05 * this.speedFactor);
          keysPressed = true;
      }

      // W -> Increase speed
      if (this.gui.isKeyPressed("KeyW")) {
          this.heli.accelerate(0.01 * this.speedFactor);
          keysPressed = true;
      }

      // S -> Decrease speed
      if (this.gui.isKeyPressed("KeyS")) {
          this.heli.accelerate(-0.01 * this.speedFactor);
          keysPressed = true;
      }

      // R -> Reset helicopter's position
      if (this.gui.isKeyPressed("KeyR")) {
        this.heli.reset();
        console.log("Eagle has returned to base.");
      }

      // L -> Land or fill bucket
      if (this.gui.isKeyPressed("KeyL")) {
          if (this.heli.state === "overLake" && this.heli.overLake() && this.heli.y <= 3 && this.heli.velY === 0 && this.heli.bucketEmpty) {
              this.heli.startFilling(this.time);
          } else {
              this.heli.startLanding();
          }
      }
    }

    // P -> Take off
    if (this.gui.isKeyPressed("KeyP")) {
        if (!this.heli.fillingBucket && !this.heli.bucketEmpty && this.heli.state === "overLake") {
            this.heli.state = "ascending";
            this.heli.velY = 3;
        } else if (!this.heli.fillingBucket) {
            this.heli.startTakeOff();
        }
    }

    // O -> Drop water
    if (this.gui.isKeyPressed("KeyO")) {
      this.heli.dropRequested = true;
    }
  }
 
  update(t) {
    this.checkKeys();
    this.heli.update(t);

    // Day/Night
    if (this.isNight) {
      this.lights[0].setDiffuse(0.1, 0.1, 0.3, 1.0);
      this.lights[0].setAmbient(0.1, 0.1, 0.1, 1.0);
    } else {
      this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
      this.lights[0].setAmbient(0.5, 0.5, 0.5, 1.0);
    }
    this.lights[0].update();

    // Helicopter POV camera
    if (this.heliPOV) {
      const distance = 20;
      const height = 15;

      const heliCenterX = this.heli.x;
      const heliCenterY = this.heli.y - 0.2;
      const heliCenterZ = this.heli.z - 4.5;

      const cameraX = heliCenterX - distance * Math.sin(this.heli.orientationY);
      const cameraY = heliCenterY + height;
      const cameraZ = heliCenterZ - distance * Math.cos(this.heli.orientationY);

      const lookAtX = heliCenterX + 2 * Math.sin(this.heli.orientationY);
      const lookAtY = heliCenterY + 1;
      const lookAtZ = heliCenterZ + 2 * Math.cos(this.heli.orientationY);

      this.camera.setPosition(vec3.fromValues(cameraX, cameraY, cameraZ));
      this.camera.setTarget(vec3.fromValues(lookAtX, lookAtY, lookAtZ));
    }

    this.cameraX = this.camera.position[0];
    this.cameraZ = this.camera.position[2];
    this.time = t;
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

  async getLakePoints() {
      // Load the mask image
      const img = new window.Image();
      img.src = "textures/lake_mask.png";
      await new Promise(resolve => { img.onload = resolve; });

      // Create a canvas to read pixel data
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, img.width, img.height).data;

      // Lake world coordinates
      const lakeWorldX = 70;
      const lakeWorldZ = -10;
      const lakeWorldWidth = 70;
      const lakeWorldHeight = 70;

      let validPoints = [];

      for (let y = 0; y < img.height; y++) {
          for (let x = 0; x < img.width; x++) {
              const idx = (y * img.width + x) * 4;
              const r = imageData[idx], g = imageData[idx+1], b = imageData[idx+2];
              if (r < 10 && g < 10 && b < 10) {
                  const worldX = lakeWorldX - lakeWorldWidth/2 + (x / img.width) * lakeWorldWidth;
                  const worldZ = lakeWorldZ - lakeWorldHeight/2 + (y / img.height) * lakeWorldHeight;
                  validPoints.push({ x: worldX, z: worldZ });
              }
          }
      }

      this.heli.lakeValidPoints = validPoints;
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
    
    // Panorama
    if (this.panorama) this.panorama.display();    

    // Grass
    this.grassTexture.apply();
    this.pushMatrix();
    this.scale(400, 400, 400);
    this.rotate(-90 * Math.PI / 180, 1, 0, 0);
    this.plane.display();
    this.popMatrix();

    // Building
    if (this.building) {
      this.pushMatrix();
      this.translate(this.buildingX, 0, this.buildingZ);

      // Adjust building brightness for night mode
      if (this.isNight) {
        this.building.wallAppearance.setAmbient(0.3, 0.2, 0.1, 1);
        this.building.wallAppearance.setDiffuse(0.3, 0.2, 0.1, 1);
        this.windowTexture.setEmission(0.5, 0.5, 0.5, 1);
        this.heli.body.heliWindows.setEmission(0.5, 0.5, 0.5, 1);
      } else {
        this.building.wallAppearance.setAmbient(0.8, 0.6, 0.3, 1);
        this.building.wallAppearance.setDiffuse(0.8, 0.6, 0.3, 1);
        this.windowTexture.setEmission(0, 0, 0, 1);
        this.heli.body.heliWindows.setEmission(0, 0, 0, 1);
      }

      this.building.display();
      this.popMatrix();
    }

    // Forest
    if (this.forest) this.forest.display();

    // Lake
    if (this.lake) {
      this.setActiveShader(this.waterShader);
      this.waterShader.setUniformsValues({ uBrightness: this.isNight ? 0.2 : 1.0 });
      this.waterAppearance.apply();
      this.textureMask.bind(2);
      this.pushMatrix();
      this.translate(70, -0.8, -10);
      this.rotate(-Math.PI / 2, 1, 0, 0);
      this.scale(70, 70, 20);
      this.lake.display();
      this.popMatrix();
      this.setActiveShader(this.defaultShader);
    }

    // Helicopter
    if (this.heli) this.heli.display();
  }
}
