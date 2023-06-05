import * as THREE from "three";
import Experience from "./Experience.js";
import PostProcessing from "./PostProcessing.js";

export default class Renderer {
    constructor() {
        this.experience = new Experience();
        this.canvas = this.experience.canvas;
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.camera = this.experience.camera;
    
        this.setInstance();
        this.setPostProcessing();
    }

    setInstance() {
        this.instance = new THREE.WebGLRenderer({
            canvas: this.canvas,
            // For post-processing
            powerPreference: "high-performance",
            antialias: true,
            stencil: false,
        });
        this.instance.physicallyCorrectLights = true;
        // this.instance.toneMapping = THREE.CineonToneMapping;
        // this.instance.toneMappingExposure = 1.75;
        // this.instance.shadowMap.enabled = true;
        // this.instance.shadowMap.type = THREE.PCFSoftShadowMap;
        this.instance.setClearColor("#211d20");
        this.instance.setSize(this.sizes.width, this.sizes.height);
        this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2));
    }

    setPostProcessing() {
        this.postProcessing = new PostProcessing(this.instance);
    }

    resize() {
        this.instance.setSize(this.sizes.width, this.sizes.height);
        this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2));
    }

    update() {
        // this.instance.render(this.scene, this.camera.instance);
        this.postProcessing.update();
    }

    destroy() {
        this.instance.dispose();
        this.instance = null;

        this.experience = null;
        this.canvas = null;
        this.sizes = null;
        this.scene = null;
        this.camera = null;
    }
}
