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

        //Checkbox for diamond
        this.gui.add(this.scene, 'displayDiamond').name('Diamond');

        //Checkbox for triangle
        this.gui.add(this.scene, 'displayTriangle').name('Triangle');

        //Checkbox for parallelogram
        this.gui.add(this.scene, 'displayParallelogram').name('Parallelogram');

        //Checkbox for small triangle
        this.gui.add(this.scene, 'displayTriangleSmall').name('Small Triangle');

        //Checkbox for big triangle
        this.gui.add(this.scene, 'displayTriangleBig').name('Big Triangle');

        //Slider element in GUI
        this.gui.add(this.scene, 'scaleFactor', 0.1, 5).name('Scale Factor');

        return true;
    }
}