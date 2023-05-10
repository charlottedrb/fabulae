
import DataManager from './Experience/Data/DataManager.js'
import Experience from './Experience/Experience.js'
import * as Taxi from '@unseenco/taxi'
import Animation from './Landing/animation.js'

/**
 * Landing
 */
const taxi = new Taxi.Core()
const animation = new Animation()

/**
 * Data
 */
const dataManager = new DataManager()

/**
 * Experience
 */
const experience = new Experience(document.querySelector('canvas.webgl'))