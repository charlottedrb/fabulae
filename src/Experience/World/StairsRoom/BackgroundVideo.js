import * as THREE from 'three'
import Experience from '../../Experience.js'
import gsap from "gsap"

export default class BackgroundVideo
{
    constructor(mesh)
    {
        this.mesh = mesh
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.camera = this.experience.camera

        this.setVideo()
    }

    setVideo()
    {
         // Start html video
        this.video = document.getElementById('video');
        this.video.play();
        this.setBackground()
    }

    setBackground()
    {
        // Get video source from html and create as a material
        this.texture = new THREE.VideoTexture(this.video);
        this.texture.wrapS = THREE.RepeatWrapping;
        this.texture.flipY = false;
        this.texture.needsUpdate = true;

        this.material = new THREE.MeshBasicMaterial( {map: this.texture, side: THREE.FrontSide, toneMapped: false} );

        this.setBackgroundVideo()
    }

    setBackgroundVideo() {
        // Apply video material to the background
        this.mesh.material = this.material
    }

    destroy() {
        this.experience = null
        this.scene = null
        this.camera = null

        this.mesh = null
        this.video = null
        this.texture.dispose()
        this.texture = null
        this.material.dispose()
        this.material = null
    }
}