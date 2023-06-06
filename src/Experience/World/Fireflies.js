import * as THREE from 'three'
import Experience from '../Experience.js'
import gsap from "gsap"

export default class Fireflies
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.time = this.experience.time
        this.sizes = this.experience.sizes

        this.setGeometry()
        this.setMaterial()
        this.setMesh()

        this.sizes.on('resize', this.resize.bind(this))
    }

    setGeometry()
    {
        this.geometry = new THREE.BufferGeometry()
        const firefliesCount = 150
        const positionArray = new Float32Array(firefliesCount * 3)
        const scaleArray = new Float32Array(firefliesCount)
        for(let i = 0; i < firefliesCount; i++)
        {
            positionArray[i * 3 + 0] = (Math.random() - 0.5) * 5
            positionArray[i * 3 + 1] = Math.random() * 3.5
            positionArray[i * 3 + 2] = (Math.random() - 0.5) * 4
            scaleArray[i] = Math.random()
        }

        this.geometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3))
        this.geometry.setAttribute('aScale', new THREE.BufferAttribute(scaleArray, 1))
    }

    setMaterial()
    {
        // this.material = new THREE.PointsMaterial({ size: 0.1, sizeAttenuation: true })
        this.material = new THREE.ShaderMaterial({
            depthWrite: false,
            // transparent: true,
            blending: THREE.AdditiveBlending,
            uniforms:
            {
                uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
                uSize: { value: 100 },
                uTime: { value: 0 },
            },
            vertexShader: `
                uniform float uPixelRatio;
                uniform float uSize;
                uniform float uTime;
                attribute float aScale;

                void main()
                {
                    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
                    modelPosition.y += sin(uTime + modelPosition.x * 100.0) * aScale * 0.2;
                    vec4 viewPosition = viewMatrix * modelPosition;
                    vec4 projectionPosition = projectionMatrix * viewPosition;
                
                    gl_Position = projectionPosition;
                    gl_PointSize = uSize * aScale * uPixelRatio;
                    gl_PointSize *= (1.0 / - viewPosition.z);
                }
            `,
            fragmentShader: `
                void main()
                {
                    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
                    float strength = 0.05 / distanceToCenter - 0.1;

                    // gl_FragColor = vec4(0.64, 0.93, 0.96, strength);
                    gl_FragColor = vec4(1.0, 0.91, 0.51, strength);
                }
            `
        })
    }

    setMesh()
    {
        this.mesh = new THREE.Points(this.geometry, this.material)
        this.scene.add(this.mesh)
    }

    resize() {
        this.material.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2)
    }

    update() {
        this.material.uniforms.uTime.value = (this.time.elapsed / 1500)
    }

    destroy() {
        this.geometry.dispose()
        this.geometry = null
        this.material.dispose()
        this.material = null
        this.mesh = null

        this.experience = null
        this.scene = null
        this.time = null
        this.sizes = null
    }
}