import Experience from "../Experience"
import * as THREE from 'three'

export default class Particles {
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene

        this.init()
        this.events()

    }
    init()
    {
        this.mouse = {
            x: null, 
            y: null
        }

        this.geometry = new THREE.BufferGeometry()
        this.vertices = []

        this.setVertices()
        this.geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( this.vertices, 3 ) )

        const sprite = new THREE.TextureLoader().load( 'textures/sprites/glow-disc.png' );
        sprite.colorSpace = THREE.SRGBColorSpace;

        const material = new THREE.PointsMaterial( { size: 35, map: sprite, sizeAttenuation: true, alphaTest: 0.5, transparent: true } );
        material.color.setHSL( 1.0, 0.3, 0.7, THREE.SRGBColorSpace );

        this.particles = new THREE.Points( this.geometry, material );

        this.scene.add(this.particles)
    }

    update()
    {
        this.particles.rotation.y += 0.0003
    }

    events()
    {
        window.addEventListener('mousemove', this.onMouseMove.bind(this))
    }

    onMouseMove(event)
    {
        this.mouse.x = event.clientX
        this.mouse.y = event.clientY

        this.particles.position.x = this.mouse.x * 0.0001
        this.particles.position.y = this.mouse.y * 0.0001
    }

    setVertices()
    {
        for ( let i = 0; i < 10000; i ++ ) {

            const x = 20 * Math.random() - 10;
            const y = 20 * Math.random() - 10;
            const z = 20 * Math.random() - 10;

            this.vertices.push( x, y, z );

        }
    }

    destroy() { }
}