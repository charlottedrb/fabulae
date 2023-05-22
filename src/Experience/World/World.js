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

        // Wait for resources
        this.resources.on('ready', () =>
        {
            // Setup
            this.environment = new Environment()

            console.log('resources', this.resources);
            this.stairsRoom = new StairsRoom()
        })
    }

    update()
    {
        if (this.stairsRoom) {
            this.stairsRoom.update()
        }
    }

    destroy() {
        if (this.floor) {
            this.floor.destroy()
            this.floor = null
        }

        if (this.environment) {
            this.environment.destroy()
            this.environment = null
        }

        if (this.stairsRoom) {
            this.stairsRoom.destroy()
            this.stairsRoom = null
        }

        this.experience = null
        this.scene = null
        this.resources = null
    }
}