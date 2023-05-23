import * as THREE from 'three'
import Experience from '../../Experience.js'
import gsap from "gsap"

export default class TransitionShader
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.camera = this.experience.camera

        this.setMesh()
    }

    setMesh() {
        this.material = new THREE.ShaderMaterial({
            transparent: true,
            uniforms:
            {
                uAlpha: { value: 0 }
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
                    gl_FragColor = vec4(1.0, 1.0, 1.0, uAlpha);
                }
            `
        })
        this.transitionMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2, 1, 1), this.material)
        this.scene.add(this.transitionMesh)
    }

    start() {
        this.transitionMesh.position.set(this.camera.instance.position)
        gsap.to(this.material.uniforms.uAlpha, { duration: 2, value: 1, delay: 1 })
    }

    end() {
        gsap.to(this.material.uniforms.uAlpha, { duration: 2, value: 0, delay: 1 })
    }

    destroy() {
        this.experience = null
        this.scene = null
        this.camera = null

        this.material.dispose()
        this.material = null
        this.transitionMesh.geometry.dispose()
        this.transitionMesh = null
    }
}