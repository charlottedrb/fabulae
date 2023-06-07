import * as THREE from 'three'
import Experience from '../Experience.js'
import gsap from "gsap"

export default class VisualLoader
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        this.loadingRate = document.querySelector('.rate')
        this.loadingCircle = document.querySelector('.loader-circle')
        this.resources.on('progress', (progressRatio) => {
            this.updateLoadingRate(progressRatio)
        })

        this.setGeometry()
        this.setMaterial()
        this.setMesh()
    }

    setGeometry()
    {
        this.geometry = new THREE.PlaneGeometry(2, 2, 1, 1)
    }

    setMaterial()
    {
        this.material = new THREE.ShaderMaterial({
            transparent: true,
            uniforms:
            {
                uAlpha: { value: 1 }
            },
            vertexShader: `
                void main()
                {
                    gl_Position = vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float uAlpha;
        
                void main()
                {
                    gl_FragColor = vec4(0.007, 0.04, 0.165, uAlpha);
                }
            `
        })
    }

    setMesh()
    {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.scene.add(this.mesh)
    }

    disapear() {
        const tl = gsap.timeline({ delay: 1 })
        tl.to(this.material.uniforms.uAlpha, { duration: 0.25, value: 0 })
        tl.to(document.querySelector('.loader'), { duration: 0.25, opacity: 0 }, "<")
        tl.to(document.querySelector('.loader-gif'), { duration: 0.25, opacity: 0 }, "<")
        tl.to(document.querySelector('.loader-circle'), { duration: 0.25, opacity: 0 }, "<")
    }

    updateLoadingRate(progressRatio) {
        this.loadingRate.innerHTML = Math.round(progressRatio * 100)
        this.loadingCircle.style.strokeDashoffset = 2140 - (2140 * progressRatio)
    }

    destroy() {
        this.resources.off('progress')
        this.loadingRate = null
        this.geometry.dispose()
        this.geometry = null
        this.scene.remove(this.mesh)
        this.mesh = null
        this.material.dispose()
        this.material = null

        this.experience = null
        this.scene = null
        this.resources = null
    }
}