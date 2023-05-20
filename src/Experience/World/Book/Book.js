import * as THREE from 'three'
import Experience from '../../Experience.js'
import gsap from 'gsap'
import InterfaceUI from '../../InterfaceUI.js'

export default class Book {
    constructor(parent, position)
    {
        this.experience = new Experience()
        this.parent = parent
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.resource = this.resources.items.blueBookModel

        this.position = position || new THREE.Vector3(0, 0, 0)

        this.setModel()
    }

    setModel() 
    {
        this.model = this.resource.scene.clone()
        this.model.receiveShadow = true
        this.model.rotation.z = - Math.PI * 0.5
        this.model.position.set(this.position.x, this.position.y, this.position.z)
        this.scene.add(this.model)
    }

    hoverOut()
    {
        gsap.to(this.model.position, {
            duration: 0.2,
            z: this.model.position.z + 0.25,
            ease: 'power3.inOut'
        })
    }

    hoverIn()
    {
        gsap.to(this.model.position, {
            duration: 0.3,
            z: this.model.position.z - 0.25,
            ease: 'power3.inOut'
        })
    }

    clickOut()
    {
        gsap.to(this.model.position, {
            duration: 1,
            z: this.model.position.z + 0.2,
            ease: 'power3.inOut'
        })
    }

    clickIn()
    {
        gsap.to(this.model.position, {
            duration: 1,
            z: this.model.position.z - 0.2,
            ease: 'power3.inOut'
        })
    }

    addDebug()
    {
        
    }

    destroy()
    {
        this.model.dispose()
        this.model = null
        this.scene.remove(this.model)
    }
}