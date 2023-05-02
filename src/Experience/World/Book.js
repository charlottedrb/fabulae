import * as THREE from 'three'
import Experience from '../Experience.js'

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
        console.log(this.mesh);
        this.scene.add(this.mesh)
    }

    checkPosition() 
    {

    }
}