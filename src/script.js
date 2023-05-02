
import Experience from './Experience/Experience.js'
import * as Taxi from '@unseenco/taxi'
import Animation from './Landing/animation.js'

/**
 * Landing
 */
const taxi = new Taxi.Core()
const animation = new Animation()

/**
 * Experience
 */
const experience = new Experience(document.querySelector('canvas.webgl'))