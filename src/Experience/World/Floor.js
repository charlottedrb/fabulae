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
        this.geometry = new THREE.BoxGeometry(10, 0.1, 2)
        this.geometry.rotateX(- Math.PI * 0.5)
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
        this.mesh.rotation.x = - Math.PI * 0.5
        this.mesh.receiveShadow = true
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