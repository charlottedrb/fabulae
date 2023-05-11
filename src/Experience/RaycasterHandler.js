import * as THREE from 'three'
import Experience from './Experience.js'

export default class RaycasterHandler
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.time = this.experience.time
        this.sizes = this.experience.sizes
        this.camera = this.experience.camera

        this.raycaster = new THREE.Raycaster()
        this.mouse = new THREE.Vector2(-1, -1)
        this.currentIntersect = null
        this.objectsToTest = []
        this.callbacks = {}

        this.moveBound = this.move.bind(this)
        window.addEventListener('mousemove', this.moveBound)
    }

    move(event) {
        this.mouse.x = event.clientX / this.sizes.width * 2 - 1
        this.mouse.y = - (event.clientY / this.sizes.height) * 2 + 1
    }

    addObjectToTest(object, callback) {
        if (Array.isArray(object)) {
            object.forEach((obj) => {
                this.objectsToTest.push(obj)
                this.callbacks[obj.uuid] = callback
            })
        } else {
            this.objectsToTest.push(object)
            this.callbacks[object.uuid] = callback
        }
    }

    update() {
        this.raycaster.setFromCamera(this.mouse, this.camera.instance)
        const intersects = this.raycaster.intersectObjects(this.objectsToTest)

        if(intersects.length)
        {
            if(!this.currentIntersect)
            {
                // console.log('mouse enter')
            }

            this.currentIntersect = intersects[0]
            if (this.callbacks[this.currentIntersect.object.uuid]) {
                this.callbacks[this.currentIntersect.object.uuid]()
            }
        }
        else
        {
            if(this.currentIntersect)
            {
                // console.log('mouse leave')
            }
            
            this.currentIntersect = null
        }
    }

    destroy() {
        window.removeEventListener('mousemove', this.moveBound)
        this.moveBound = null

        this.raycaster = null
        this.mouse = null
        this.currentIntersect = null
        this.objectsToTest = null
        this.callbacks = null

        this.scene = null
        this.time = null
        this.sizes = null
        this.camera = null
    }
}