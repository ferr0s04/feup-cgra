import { CGFobject } from '../lib/CGF.js';
import { MyTree } from './MyTree.js';
import { MyFire } from './MyFire.js';

/**
 * MyForest
 * @constructor
 * @param scene - Reference to MyScene object
 * @param rows - Number of rows of trees
 * @param cols - Number of columns of trees
 * @param width - Width of the forest area
 * @param depth - Depth of the forest area
 * @param useTextures - Whether to use textures for trees
 * @param templateCount - Number of different unique tree templates to create
 */
export class MyForest extends CGFobject {
    constructor(scene, rows, cols, width = 30, depth = 30, useTextures = false, templateCount = 4) {
        super(scene);
        this.rows = rows;
        this.cols = cols;
        this.width = width;
        this.depth = depth;
        this.useTextures = useTextures;
        this.templateCount = templateCount;
        this.forestX = 0;
        this.forestZ = 50;
        
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
        this.fires = [];
        this.createFires();
    }

    checkFireExtinguish(x, z, range) {
        for (let i = this.fires.length - 1; i >= 0; i--) {
            const fire = this.fires[i];
            const dx = fire.x - x;
            const dz = fire.z - z;
            const distance = Math.sqrt(dx * dx + dz * dz);

            if (distance < range) {
                this.fires.splice(i, 1);
            }
        }
    }

    createFires() {
        // First, select a random starting tree
        const startTreeIndex = Math.floor(Math.random() * this.treeInstances.length);
        const startTree = this.treeInstances[startTreeIndex];
        const fireCount = 20 + Math.floor(Math.random() * 2);
        const usedPositions = new Set([startTreeIndex]);
        this.fires = [];

        // Create first fire at the starting tree
        this.fires.push(new MyFire(
            this.scene,
            startTree.posX + (Math.random() - 0.5) * 5,
            startTree.posZ + (Math.random() - 0.5) * 5,
            3.5 + Math.random() * 2.0
        ));

        // Find nearby trees for remaining fires
        for (let i = 1; i < fireCount; i++) {
            let closestTree = null;
            let minDistance = Infinity;
            let selectedIndex = -1;

            // Search for nearby trees that haven't been used
            for (let j = 0; j < this.treeInstances.length; j++) {
                if (usedPositions.has(j)) continue;

                const tree = this.treeInstances[j];
                const dx = tree.posX - startTree.posX;
                const dz = tree.posZ - startTree.posZ;
                const distance = Math.sqrt(dx * dx + dz * dz);

                // Only consider trees within a reasonable radius (adjust 15 to control spread)
                if (distance < 30 && distance < minDistance) {
                    minDistance = distance;
                    closestTree = tree;
                    selectedIndex = j;
                }
            }

            if (closestTree) {
                usedPositions.add(selectedIndex);
                this.fires.push(new MyFire(
                    this.scene,
                    closestTree.posX + (Math.random() - 0.5) * 6,
                    closestTree.posZ + (Math.random() - 0.5) * 6,
                    2.0 + Math.random() * 1.5
                ));
            }
        }
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
        this.scene.pushMatrix();
        this.scene.translate(0, 0, this.forestZ);
        // Display trees
        for (const instance of this.treeInstances) {
            this.scene.pushMatrix();
            this.scene.translate(instance.posX, 0, instance.posZ);
            const template = this.treeTemplates[instance.templateIndex];
            template.display();
            this.scene.popMatrix();
        }

        // Display fires
        this.scene.setDefaultAppearance(); // Reset appearance before drawing fires
        for (const fire of this.fires) {
            fire.update(this.scene.time);
            fire.display();
        }

        this.scene.popMatrix();
    }
}