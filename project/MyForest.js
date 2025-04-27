import { CGFobject } from '../lib/CGF.js';
import { MyTree } from './MyTree.js';

export class MyForest extends CGFobject {
    constructor(scene, rows, cols, width = 30, depth = 30, useTextures = false, templateCount = 4) {
        super(scene);
        this.rows = rows;
        this.cols = cols;
        this.width = width;
        this.depth = depth;
        this.useTextures = useTextures;
        this.templateCount = templateCount;
        
        // Texturas do tronco
        this.trunkTextures = [
            "textures/trunk1.jpg",
            "textures/trunk2.jpg"
        ];

        // Texturas da copa
        this.foliageTextures = [
            "textures/leaves1.jpg",
            "textures/leaves2.jpg",
            "textures/leaves3.jpg"
        ];
        
        this.treeTemplates = this.createTreeTemplates(this.templateCount);
        this.treeInstances = this.createTreeInstances();
    }
    
    createTreeTemplates(count) {
        const templates = [];
        
        for (let i = 0; i < count; i++) {
            // Parâmetros para cada modelo de árvore
            const rotationDeg = Math.random() * 20 - 10;
            const rotationAxis = Math.random() < 0.5 ? 'X' : 'Z';
            const trunkBaseRadius = 0.5 + Math.random() * 0.1;
            const treeHeight = 7 + Math.random() * 10;
            const foliageColor = [
                0.1 + Math.random() * 0.2,
                0.4 + Math.random() * 0.3,
                0.1 + Math.random() * 0.2
            ];

            // Escolha de texturas
            const trunkAppearance = this.useTextures
                ? this.randomFrom(this.trunkTextures)
                : null;
            const foliageAppearance = this.useTextures
                ? this.randomFrom(this.foliageTextures)
                : null;

            const template = new MyTree(
                this.scene,
                rotationDeg,
                rotationAxis,
                trunkBaseRadius,
                treeHeight,
                foliageColor,
                trunkAppearance,
                foliageAppearance
            );
            
            templates.push(template);
        }
        
        return templates;
    }
    
    createTreeInstances() {
        const instances = [];
        const spacingX = this.width / this.cols;
        const spacingZ = this.depth / this.rows;
        
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                const offsetX = (Math.random() - 0.5) * spacingX * 0.4;
                const offsetZ = (Math.random() - 0.5) * spacingZ * 0.4;

                // Posição da árvore
                const posX = -this.width / 2 + j * spacingX + spacingX / 2 + offsetX;
                const posZ = -this.depth / 2 + i * spacingZ + spacingZ / 2 + offsetZ;
                
                // Select a random template
                const templateIndex = Math.floor(Math.random() * this.treeTemplates.length);
                
                // Store just the position and template reference
                instances.push({
                    templateIndex: templateIndex,
                    posX: posX,
                    posZ: posZ
                });
            }
        }
        
        return instances;
    }

    randomFrom(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    display() {
        for (const instance of this.treeInstances) {
            this.scene.pushMatrix();
            this.scene.translate(instance.posX, 0, instance.posZ);
            
            // Get the template tree and display it
            const template = this.treeTemplates[instance.templateIndex];
            template.display();
            
            this.scene.popMatrix();
        }
    }
}