
import DataManager from './Experience/Data/DataManager.js'
import Experience from './Experience/Experience.js'
import * as Taxi from '@unseenco/taxi'

const taxi = new Taxi.Core()

const dataManager = new DataManager()
const experience = new Experience(document.querySelector('canvas.webgl'))