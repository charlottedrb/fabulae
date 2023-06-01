// import * as THREE from 'three';
// import Experience from './Experience';
// // Post processing
// import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';
// import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
// import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
// import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

// // Shaders
// import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';
// import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js';


// export default class PostProcessing {
    
//     constructor() {
//         this.experience = new Experience();
//         this.debug = this.experience.debug;
//         this.composer = new EffectComposer(this.experience.renderer.instance);
//         this.renderPass = new RenderPass(this.experience.scene, this.experience.camera.instance);
//         this.composer.addPass(this.renderPass);

//         this.outlinePass = new OutlinePass(new THREE.Vector2(this.experience.sizes.width, this.experience.sizes.height), this.experience.scene, this.experience.camera.instance);
//         this.composer.addPass(this.outlinePass);

//         this.gammaPass = new ShaderPass(GammaCorrectionShader);
//         this.composer.addPass(this.gammaPass);

//         this.fxaaPass = new ShaderPass(FXAAShader);
//         this.fxaaPass.uniforms['resolution'].value.x = 1 / (this.experience.sizes.width * this.experience.renderer.instance.getPixelRatio());
//         this.composer.addPass(this.fxaaPass);
//     }

//     update() {
//         this.composer.render();
//     }

//     outlineObject(object) {
//         this.outlinePass.selectedObjects = [object];
//     }
// }