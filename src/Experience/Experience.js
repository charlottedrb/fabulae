import * as THREE from 'three'

import Debug from './Utils/Debug.js'
import Sizes from './Utils/Sizes.js'
import Time from './Utils/Time.js'
import Camera from './Camera.js'
import Renderer from './Renderer.js'
import World from './World/World.js'
import Resources from './Utils/Resources.js'
import sources from './sources.js'
import RaycasterHandler from './RaycastHandler.js'

let instance = null

export default class Experience
{
    constructor(_canvas)
    {
        // Singleton
        if(instance)
        {
            return instance
        }
        instance = this
        
        // Global access
        window.experience = this

        // Options
        this.canvas = _canvas

        // Setup
        this.debug = null
        this.sizes = null
        this.time = null
        this.scene = null
        this.resources = null
        this.camera = null
        this.renderer = null
        this.world = null
        this.raycastHandler = null

        this.resizeBound = this.resize.bind(this)
        this.updateBound = this.update.bind(this)

        this.init()
    }

    init() {
        // Setup
        this.debug = new Debug()
        this.sizes = new Sizes()
        this.time = new Time()
        this.scene = new THREE.Scene()
        this.resources = new Resources(sources)
        this.camera = new Camera()
        this.renderer = new Renderer()
        this.world = new World()
        this.raycastHandler = new RaycasterHandler()

        // Resize event
        this.sizes.on('resize', this.resizeBound)

        // Time tick event
        this.time.on('tick', this.updateBound)
    }

    resize()
    {
        this.camera.resize()
        this.renderer.resize()
    }

    update()
    {
        this.camera.update()
        this.world.update()
        this.renderer.update()

        if (this.raycastHandler) {
            this.raycastHandler.update()
        }
    }

    destroy()
    {
        this.sizes.off('resize', this.resizeBound)
        this.time.off('tick', this.updateBound)

        // Traverse the whole scene
        this.scene.traverse((child) =>
        {
            // Test if it's a mesh
            if(child instanceof THREE.Mesh)
            {
                child.geometry.dispose()

                // Loop through the material properties
                for(const key in child.material)
                {
                    const value = child.material[key]

                    // Test if there is a dispose function
                    if(value && typeof value.dispose === 'function')
                    {
                        value.dispose()
                    }
                }
            }
        })

        // this.camera.controls.dispose()
        // this.renderer.instance.dispose()

        if(this.debug.active) {
            this.debug.ui.destroy()
        }

        this.canvas = null
        this.debug = null
        this.sizes = null
        this.time = null
        this.scene = null
        this.resources = null

        this.camera.destroy()
        this.camera = null
        this.renderer.destroy()
        this.renderer = null
        this.world.destroy()
        this.world = null
        this.raycastHandler.destroy()
        this.raycastHandler = null

        this.resizeBound = null
        this.updateBound = null
    }
}