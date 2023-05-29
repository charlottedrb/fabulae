import * as THREE from 'three'
import Experience from './Experience.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js'

export default class BloomEffect
{
    constructor(renderer)
    {
        this.renderer = renderer
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.camera = this.experience.camera
        this.debug = this.experience.debug
        this.sizes = this.experience.sizes

        this.ENTIRE_SCENE = 0
        this.BLOOM_SCENE = 1;

        this.darkMaterial = new THREE.MeshBasicMaterial( { color: 'black' } );
        this.materials = {};

        this.bloomLayer = new THREE.Layers();
        this.bloomLayer .set(this.BLOOM_SCENE);

        const renderPass = new RenderPass(this.scene, this.camera.instance);
        const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
        bloomPass.threshold = 0
        bloomPass.strength = 1
        bloomPass.radius = 2

        if(this.debug.active) {
            this.debug.ui.add(bloomPass, 'enabled')
            this.debug.ui.add(bloomPass, 'strength').min(0).max(2).step(0.001)
            this.debug.ui.add(bloomPass, 'radius').min(0).max(2).step(0.001)
            this.debug.ui.add(bloomPass, 'threshold').min(0).max(1).step(0.001)
        }

        this.bloomComposer = new EffectComposer(this.renderer);
        this.bloomComposer.renderToScreen = false;
        this.bloomComposer.addPass(renderPass);
        this.bloomComposer.addPass(bloomPass);

        const finalPass = new ShaderPass(
            new THREE.ShaderMaterial( {
                uniforms: {
                    baseTexture: { value: null },
                    bloomTexture: { value: this.bloomComposer.renderTarget2.texture }
                },
                vertexShader: `
                    varying vec2 vUv;

                    void main() {
                        vUv = uv;

                        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
                    }
                `,
                fragmentShader: `
                    uniform sampler2D baseTexture;
                    uniform sampler2D bloomTexture;
        
                    varying vec2 vUv;
        
                    void main() {
                        gl_FragColor = ( texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) );
                    }
                `,
                defines: {}
            } ), 'baseTexture'
        );
        finalPass.needsSwap = true;

        this.finalComposer = new EffectComposer(this.renderer);
        this.finalComposer.addPass(renderPass);

        // Correct colors otherwise it's too dark
        const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader)
        this.finalComposer.addPass(gammaCorrectionPass)

        // Correct antialiasing if needed
        if(this.renderer.getPixelRatio() === 1 && !this.renderer.capabilities.isWebGL2)
        {
            const smaaPass = new SMAAPass()
            this.finalComposer.addPass(smaaPass)
        }

        this.finalComposer.addPass(finalPass);

        this.darkenNonBloomedBound = this.darkenNonBloomed.bind(this)
        this.restoreMaterialBound = this.restoreMaterial.bind(this)
    }

    renderBloom() {
        this.scene.traverse(this.darkenNonBloomedBound);
        this.bloomComposer.render();
        this.scene.traverse(this.restoreMaterialBound);
    }

    darkenNonBloomed(obj) {
        if (obj.isMesh && this.bloomLayer .test(obj.layers) === false) {
            this.materials[obj.uuid] = obj.material
            obj.material = this.darkMaterial
        }
    }

    restoreMaterial(obj) {
        if (this.materials[obj.uuid]) {
            obj.material = this.materials[obj.uuid];
            delete this.materials[obj.uuid];
        }
    }

    update() {
        this.renderBloom()
        this.finalComposer.render()
    }

    resize() {
        this.bloomComposer.setSize(this.sizes.width, this.sizes.height)
        this.bloomComposer.setPixelRatio(Math.min(this.sizes.pixelRatio, 2))
        this.finalComposer.setSize(this.sizes.width, this.sizes.height)
        this.finalComposer.setPixelRatio(Math.min(this.sizes.pixelRatio, 2))
    }

    destroy() {
        this.renderer = null
        this.experience = null
        this.scene = null
        this.camera = null
        this.debug = null
        this.sizes = null

        this.ENTIRE_SCENE = null
        this.BLOOM_SCENE = null
        this.darkMaterial = null
        this.materials = null
        this.bloomLayer = null
        this.bloomComposer = null
        this.finalComposer = null
        this.darkenNonBloomedBound = null
        this.restoreMaterialBound = null
    }
}