import { CGFscene, CGFcamera, CGFaxis, CGFappearance, CGFtexture, CGFshader } from "../lib/CGF.js";
import { MyLake } from "./MyLake.js";

function getStringFromUrl(url) {
	var xmlHttpReq = new XMLHttpRequest();
	xmlHttpReq.open("GET", url, false);
	xmlHttpReq.send();
	return xmlHttpReq.responseText;
}

export class ShaderScene extends CGFscene {
	constructor() {
		super();
		this.wireframe = false;
		this.showShaderCode = false;
		this.scaleFactor = 16.0;
	}

	init(application) {
		super.init(application);
		this.initCameras();
		this.initLights();

		this.gl.clearDepth(10000.0);
		this.gl.clearColor(1, 1, 1, 1.0);
		this.gl.enable(this.gl.DEPTH_TEST);
		this.gl.enable(this.gl.CULL_FACE);
		this.gl.depthFunc(this.gl.LEQUAL);

		this.axis = new CGFaxis(this);
		this.enableTextures(true);

		this.lake = new MyLake(this, 100, 0, 1, 0, 1);

		this.appearance = new CGFappearance(this);
		this.appearance.setAmbient(0.3, 0.3, 0.3, 1);
		this.appearance.setDiffuse(0.7, 0.7, 0.7, 1);
		this.appearance.setSpecular(0.0, 0.0, 0.0, 1);
		this.appearance.setShininess(120);

		this.textureWater = new CGFtexture(this, "textures/waterTex.jpg");
		this.textureWaterMap = new CGFtexture(this, "textures/waterMap.jpg");

		this.appearance.setTexture(this.textureWater);
		this.appearance.setTextureWrap('REPEAT', 'REPEAT');

		this.waterShader = new CGFshader(this.gl, "shaders/water.vert", "shaders/water.frag");
		this.waterShader.setUniformsValues({ uSampler2: 1, normScale: this.scaleFactor, timeFactor: 0 });

		this.setUpdatePeriod(50);
	}

	initCameras() {
		this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(20, 20, 100), vec3.fromValues(0, 0, 0));
	}

	initLights() {
		if (this.lights.length > 0) {
			this.lights[0].setPosition(0, 0, 10, 1);
			this.lights[0].setAmbient(0.2, 0.2, 0.2, 1);
			this.lights[0].setDiffuse(0.9, 0.9, 1.0, 1);
			this.lights[0].setSpecular(0, 0, 0, 1);
			this.lights[0].enable();
			this.lights[0].update();
		}
	}

	update(t) {
		this.waterShader.setUniformsValues({ timeFactor: t / 100 % 100 });
	}

	display() {
		this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

		this.updateProjectionMatrix();
		this.loadIdentity();
		this.applyViewMatrix();

		this.lights[0].update();
		this.axis.display();

		this.appearance.setTexture(this.textureWater);
		this.appearance.apply();
		this.textureWaterMap.bind(1);

		this.setActiveShader(this.waterShader);

		this.pushMatrix();
		this.scale(50, 1, 50);
		this.lake.display();
		this.popMatrix();

		this.setActiveShader(this.defaultShader);
	}
}
