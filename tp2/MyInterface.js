import {CGFinterface, dat} from '../lib/CGF.js';

/**
* MyInterface
* @constructor
*/
export class MyInterface extends CGFinterface {
    constructor() {
        super();
    }

    // Initalize interface
    init(application) {
        // call CGFinterface init
        super.init(application);
        
        // init GUI. For more information on the methods, check:
        // https://github.com/dataarts/dat.gui/blob/master/API.md
        this.gui = new dat.GUI();

        //Checkbox element in GUI
        this.gui.add(this.scene, 'displayAxis').name('Display Axis');

        //Checkbox for tangram
        this.gui.add(this.scene, 'displayTangram').name('Tangram');

        //Checkbox for unit cube
        this.gui.add(this.scene, 'displayUnitCube').name('Unit Cube');

        //Checkbox for quad cube
        this.gui.add(this.scene, 'displayUnitCubeQuad').name('Quad Cube');

        //Slider element in GUI
        this.gui.add(this.scene, 'scaleFactor', 0.1, 5).name('Scale Factor');

        return true;
    }
}