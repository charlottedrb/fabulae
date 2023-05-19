
import DataManager from './Data/DataManager.js'
import Experience from './Experience/Experience.js'
import * as Taxi from '@unseenco/taxi'
import Animation from './Landing/animation.js'
import BackOffice from './BackOffice/BackOffice.js'
import Story from './BackOffice/Story.js'

/**
 * Landing
 */
const taxi = new Taxi.Core()

if (window.location.pathname === '/') {
    const animation = new Animation()
}

/**
 * Data
 */
const dataManager = new DataManager()

/**
 * Experience
 */
if (window.location.pathname === '/experience.html') {
    const experience = new Experience(document.querySelector('canvas.webgl'))
}

/**
 * Back-office
 */
if (window.location.pathname === '/back-office.html') {
    const backOffice = new BackOffice()
}

if (window.location.pathname === '/create-story.html') {
    const story = new Story()
}