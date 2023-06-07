import Experience from '../Experience/Experience.js'
import * as Taxi from '@unseenco/taxi'

/**
 * Landing
 */
const taxi = new Taxi.Core()

/**
 * Experience
 */
const experience = new Experience(document.querySelector('canvas.webgl'))