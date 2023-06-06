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
        this.timings = {}
        this.indexes = {}

        this.moveBound = this.move.bind(this)
        window.addEventListener('mousemove', this.moveBound)

        this.onClickHandlerBound = this.onClickHandler.bind(this)
        window.addEventListener('click', this.onClickHandlerBound)
    }

    move(event) {
        this.mouse.x = event.clientX / this.sizes.width * 2 - 1
        this.mouse.y = - (event.clientY / this.sizes.height) * 2 + 1
    }

    onClickHandler() {
        if(this.currentIntersect)
        {
            let uniqueID = null
            this.indexes[this.currentIntersect.object.uuid].forEach(element => {
                const timing = element.split('_')[1]
                if (timing == 'click') {
                    uniqueID = element
                }
            });
            if (this.callbacks[uniqueID] && (this.timings[uniqueID] == 'click')) {
                this.callbacks[uniqueID]()
            }
        }
    }

    addObjectToTest(object, callback, timing = 'enter') {
        const uniqueID = object.uuid + '_' + timing
        if (this.indexes[object.uuid]) {
            this.indexes[object.uuid] = this.indexes[object.uuid].concat(uniqueID)
        } else {
            this.indexes[object.uuid] = [uniqueID]
        }
        if (Array.isArray(object)) {
            object.forEach((obj) => {
                this.objectsToTest.push(obj)
                this.callbacks[uniqueID] = callback
                this.timings[uniqueID] = timing
            })
        } else {
            this.objectsToTest.push(object)
            this.callbacks[uniqueID] = callback
            this.timings[uniqueID] = timing
        }
    }

    removeObjectToTest(object, timing) {
        const uniqueID = object.uuid + '_' + timing
        const toDeleteIndex = this.indexes[object.uuid].indexOf(uniqueID)
        if (toDeleteIndex !== undefined) {
            this.indexes[object.uuid].splice(toDeleteIndex, 1)
        }
    }

    update() {
        this.raycaster.setFromCamera(this.mouse, this.camera.instance)
        const intersects = this.raycaster.intersectObjects(this.objectsToTest)
        
        if(intersects.length)
        {
            if(!this.currentIntersect)
            {
                this.currentIntersect = intersects[0]
                this.experience.interface && this.experience.cursor.onCursorEnter()
                let uniqueID = null
                this.indexes[this.currentIntersect.object.uuid].forEach(element => {
                    const timing = element.split('_')[1]
                    if (timing == 'enter') {
                        uniqueID = element
                    }
                });
                if (this.callbacks[uniqueID] && (this.timings[uniqueID] == 'enter') || (this.timings[uniqueID] == 'both')) {
                    this.callbacks[uniqueID]()
                }

            }
        }
        else
        {
            if(this.currentIntersect)
            {
                let uniqueID = null
                this.indexes[this.currentIntersect.object.uuid].forEach(element => {
                    const timing = element.split('_')[1]
                    if (timing == 'leave') {
                        uniqueID = element
                    }
                });
                if (this.callbacks[uniqueID] && (this.timings[uniqueID] == 'leave' || this.timings[uniqueID] == 'both')) {
                    this.callbacks[uniqueID]()
                }
            }
            
            this.currentIntersect = null
            this.experience.interface && this.experience.cursor.onCursorLeave()
        }
    }

    destroy() {
        window.removeEventListener('mousemove', this.moveBound)
        this.moveBound = null
        window.removeEventListener('click', this.onClickHandlerBound)
        this.onClickHandlerBound = null

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