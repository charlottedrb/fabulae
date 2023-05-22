import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Floor
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        this.setGeometry()
        this.setTextures()
        this.setMaterial()
        this.setMesh()
        this.setAxesHelper()
    }

    setGeometry()
    {
        this.geometry = new THREE.BoxGeometry(1.5, 0.1, 0.3)
    }

    setTextures()
    {
        this.textures = {}
    }

    setMaterial()
    {
        this.material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
        })
    }

    setMesh()
    {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.receiveShadow = true
        this.mesh.position.y = 0
        this.scene.add(this.mesh)
    }

    setAxesHelper()
    {
        this.axesHelper = new THREE.AxesHelper(5)
        this.scene.add(this.axesHelper)
    }

    destroy() {
        this.geometry.dispose()
        this.geometry = null
        this.scene.remove(this.mesh)
        this.mesh = null
        this.scene.remove(this.axesHelper)
        this.axesHelper = null
        this.material.dispose()
        this.material = null
        this.textures = null

        this.experience = null
        this.scene = null
        this.resources = null
    }
}