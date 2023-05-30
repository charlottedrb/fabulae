import * as THREE from 'three'
import Experience from '../../Experience.js'
import gsap from "gsap"

export default class BackgroundVideo
{
    constructor()
    {
        // Start html video
        this.video = document.getElementById('video')
        this.video.play()

        this.setTexture()
    }

    setTexture()
    {
        // Get video source from html and create as a material
        this.texture = new THREE.VideoTexture(this.video)
        this.texture.wrapS = THREE.RepeatWrapping
        this.texture.flipY = false
        this.texture.needsUpdate = true
    }

    destroy() {
        this.video = null
        this.texture.dispose()
        this.texture = null
    }
}