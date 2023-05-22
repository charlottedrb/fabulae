import * as THREE from 'three'
import Experience from './Experience.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export default class Camera
{
    constructor()
    {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas
        this.debug = this.experience.debug

        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('camera')
        }

        this.setInstance()
        // this.setControls()
    }

    setInstance()
    {
        this.instance = new THREE.PerspectiveCamera(35, this.sizes.width / this.sizes.height, 0.1, 150)
        this.instance.position.set(0, 0, 0)
        this.instance.near = 0.1
        this.instance.far = 1000
        this.scene.add(this.instance)

        if(this.debug.active)
        {   
            this.debugFolder
                .add(this.instance.position, 'x')
                .name('cameraX')
                .min(-15)
                .max(15)
                .step(0.001)
            
            this.debugFolder
                .add(this.instance.position, 'y')
                .name('cameraY')
                .min(-15)
                .max(15)
                .step(0.001)
            
            this.debugFolder
                .add(this.instance.position, 'z')
                .name('cameraZ')
                .min(-50)
                .max(15)
                .step(0.001)

            this.debugFolder
                .add(this.instance.rotation, 'x')
                .name('cameraX')
                .min(-15)
                .max(15)
                .step(0.001)
            
            this.debugFolder
                .add(this.instance.rotation, 'y')
                .name('cameraY')
                .min(-15)
                .max(15)
                .step(0.001)
            
            this.debugFolder
                .add(this.instance.rotation, 'z')
                .name('cameraZ')
                .min(-15)
                .max(15)
                .step(0.001)
        }
    }

    setControls()
    {
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.enableDamping = true
    }

    resize()
    {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    update()
    {
        // this.controls.update()
    }

    destroy() {
        this.scene.remove(this.instance)
        this.instance = null
        this.controls.dispose()
        this.controls = null

        this.experience = null
        this.sizes = null
        this.scene = null
        this.canvas = null
    }
}