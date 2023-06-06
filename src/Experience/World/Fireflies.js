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
        this.mouse = {
            x: null, 
            y: null
        }

        this.setGeometry()
        this.setMaterial()
        this.setMesh()

        this.sizes.on('resize', this.resize.bind(this))
        this.onMouseMoveBound = this.onMouseMove.bind(this)
        window.addEventListener('mousemove', this.onMouseMoveBound)
    }

    onMouseMove(event)
    {
        this.mouse.x = event.clientX / this.sizes.width - 0.5
        this.mouse.y = event.clientY / this.sizes.height - 0.5
    }

    setGeometry()
    {
        this.geometry = new THREE.BufferGeometry()
        const firefliesCount = 5000
        const positionArray = new Float32Array(firefliesCount * 3)
        const scaleArray = new Float32Array(firefliesCount)
        for(let i = 0; i < firefliesCount; i++)
        {
            positionArray[i * 3 + 0] = (Math.random() - 0.5) * 8
            positionArray[i * 3 + 1] = Math.random() * 8
            positionArray[i * 3 + 2] = (Math.random() - 0.5) * 8
            scaleArray[i] = Math.random()
        }

        this.geometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3))
        this.geometry.setAttribute('aScale', new THREE.BufferAttribute(scaleArray, 1))
    }

    setMaterial()
    {
        this.material = new THREE.ShaderMaterial({
            depthWrite: false,
            // transparent: true,
            blending: THREE.AdditiveBlending,
            uniforms:
            {
                uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
                uSize: { value: 350 },
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
                    modelPosition.y += (uTime + modelPosition.y) * aScale * 0.2;
                    modelPosition.x += (uTime + modelPosition.x) * aScale * 0.2;
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
                    // gl_FragColor = vec4(0.0, 0.0, 1.0, strength);
                }
            `
        })
    }

    setMesh()
    {
        this.mesh = new THREE.Points(this.geometry, this.material)
        this.mesh.scale.set(10, 10, 10)
        this.scene.add(this.mesh)
    }

    updateFirefliesSize() {
        this.material.uniforms.uSize.value = 250
    }

    resize() {
        if (this.material) {
            this.material.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2)
        }
    }

    update() {
        if (this.material && this.time) {
            this.material.uniforms.uTime.value = this.time.elapsed / 1000
        }
        this.mesh.position.x = (this.mouse.x / 8)
        this.mesh.position.y = (- this.mouse.y / 8) - 15
    }

    destroy() {
        window.removeEventListener('mousemove', this.onMouseMoveBound)
        this.geometry.dispose()
        this.geometry = null
        this.material.dispose()
        this.material = null
        this.mesh = null
        this.mouse = null

        this.experience = null
        this.scene = null
        this.time = null
        this.sizes = null
    }
}