import Experience from '../Experience.js'
import Environment from './Environment.js'
import Floor from './Floor.js'
import StairsRoom from './StairsRoom.js'

export default class World
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        // Setup
        this.environment = new Environment()

        // Wait for resources
        this.resources.on('ready', () =>
        {
            console.log('resources', this.resources);
            this.stairsRoom = new StairsRoom()
        })
    }

    update()
    {
        
    }

    destroy() {
        this.floor.destroy()
        this.floor = null

        if (this.environment) {
            this.environment.destroy()
            this.environment = null
        }

        this.experience = null
        this.scene = null
        this.resources = null
    }
}