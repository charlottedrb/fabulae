import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Video
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        this.video = null
        this.texture = null

        this.setVideo()
        this.setGeometry()
        this.setTextures()
        this.setMaterial()
        this.setMesh()
    }

    setVideo()
    {
        this.video = document.getElementById('video');
        this.video.play();
    }

    setGeometry()
    {
        this.geometry = new THREE.CylinderGeometry(5, 5, 10, 8, 1, true, 0, Math.PI)
    }

    setTextures()
    {
        this.texture = new THREE.VideoTexture(this.video);
        this.texture.wrapS = THREE.RepeatWrapping;
        this.texture.repeat.x = - 1;
        this.texture.needsUpdate = true;
        // this.texture.minFilter = THREE.LinearFilter;
        // this.texture.magFilter = THREE.LinearFilter;
    }

    setMaterial()
    {
        this.material = new THREE.MeshBasicMaterial( {map: this.texture, side: THREE.BackSide, toneMapped: false} );
    }

    setMesh()
    {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.position.y = 1
        this.mesh.rotation.y = Math.PI / 2
        this.scene.add(this.mesh)
    }
}