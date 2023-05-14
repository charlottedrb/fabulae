import * as THREE from 'three'
import Experience from '../../Experience.js'
import gsap from 'gsap'
import InterfaceUI from '../../InterfaceUI.js'

export default class Book {
    constructor(parent, color, position)
    {
        this.experience = new Experience()
        this.parent = parent
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        this.color = color
        this.position = position || new THREE.Vector3(0, 0, 0)

        this.setGeometry()
        this.setTextures()
        this.setMaterial()
        this.setMesh()
    }

    setGeometry()
    {
        this.geometry = new THREE.BoxGeometry(1.9, 0.5, 2)
    }

    setTextures()
    {
        this.textures = {}
    }

    setMaterial()
    {
        this.material = new THREE.MeshBasicMaterial({
            color: this.color,
        })
    }

    setMesh()
    {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.receiveShadow = true
        this.mesh.rotation.x = Math.PI * 0.5
        this.mesh.rotation.z = - Math.PI * 0.5
        this.mesh.position.set(this.position.x, this.position.y, this.position.z)
        this.scene.add(this.mesh)
    }

    hoverOut()
    {
        gsap.to(this.mesh.position, {
            duration: 0.2,
            z: this.mesh.position.z + 0.25,
            ease: 'power3.inOut'
        })
    }

    hoverIn()
    {
        gsap.to(this.mesh.position, {
            duration: 0.3,
            z: this.mesh.position.z - 0.25,
            ease: 'power3.inOut'
        })
    }

    clickOut()
    {
        gsap.to(this.mesh.position, {
            duration: 1,
            z: this.mesh.position.z + 1,
            ease: 'power3.inOut'
        })
    }

    clickIn()
    {
        gsap.to(this.mesh.position, {
            duration: 1,
            z: this.mesh.position.z - 1,
            ease: 'power3.inOut'
        })
    }
}