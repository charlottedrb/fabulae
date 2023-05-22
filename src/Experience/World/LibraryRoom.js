import Experience from "../Experience";

export default class LibraryRoom {
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        this.setModels()
        this.setCamera()
    }

    init()
    {

    }

    setModels()
    {
        this.room = this.resources.items.libraryRoom
        this.scene.add(this.room.scene)
    }
    
    setCamera()
    {
        
    }

    destroy()
    {
        this.experience = null
        this.scene = null
        this.resources = null

        this.room = null
    }
}