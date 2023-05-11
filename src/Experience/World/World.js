import Experience from '../Experience.js'
import Environment from './Environment.js'
import Floor from './Floor.js'
import Stairs from './Stairs.js'

export default class World
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        // Setup
        this.floor = new Floor()

        // Wait for resources
        this.resources.on('ready', () =>
        {
            // Setup
            this.environment = new Environment()
            this.stairs = new Stairs()
            console.log('sources', this.resources);
        })
    }

    update()
    {

    }
}