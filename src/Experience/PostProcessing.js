import * as THREE from "three";
import Experience from "./Experience";
// Post processing
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { CopyShader } from "three/examples/jsm/shaders/CopyShader.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";

// Shaders
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";
import { GammaCorrectionShader } from "three/examples/jsm/shaders/GammaCorrectionShader.js";

export default class PostProcessing {
    constructor(renderer) {
        this.experience = new Experience();
        this.debug = this.experience.debug;
        this.composer = new EffectComposer(renderer);

        this.renderPass = new RenderPass(
            this.experience.scene,
            this.experience.camera.instance
        );
        this.composer.addPass(this.renderPass);

        this.outlinePass = new OutlinePass(new THREE.Vector2(this.experience.sizes.width, this.experience.sizes.height), this.experience.scene, this.experience.camera.instance);
        this.outlinePass.edgeStrength = 3.5
        this.outlinePass.edgeGlow = 1
        this.outlinePass.edgeThickness = 4
        this.outlinePass.pulsePeriod = 3.15
        this.outlinePass.visibleEdgeColor.set('#A3EEF6')
        this.composer.addPass(this.outlinePass);

        this.gammaPass = new ShaderPass(GammaCorrectionShader);
        this.composer.addPass(this.gammaPass);

        this.fxaaPass = new ShaderPass(FXAAShader);
        this.fxaaPass.uniforms['resolution'].value.x = 1 / (this.experience.sizes.width * renderer.getPixelRatio());
        this.composer.addPass(this.fxaaPass);

        this.copyPass = new ShaderPass(CopyShader);
        this.composer.addPass(this.copyPass);
    }

    update() {
        this.composer.render();
    }

    addOutlineObject(object) {
        this.outlinePass.selectedObjects = [object];
    }

    removeOutlineObject() {
        this.outlinePass.selectedObjects = [];
    }
}
