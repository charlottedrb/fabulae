import Experience from '../Experience.js'
import Environment from './Environment.js'
import Floor from './Floor.js'
import Video from './Video.js'

export default class World
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

         // Setup
         this.video = new Video()

        // Wait for resources
        this.resources.on('ready', () =>
        {
            // Setup
            this.floor = new Floor()
            this.environment = new Environment()
        })
    }

    update()
    {

    }
}