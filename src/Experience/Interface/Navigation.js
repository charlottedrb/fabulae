import Experience from "../Experience";

export default class Navigation {
    constructor()
    {
        this.experience = new Experience()
        this.libraryRoom = this.experience.world.libraryRoom
        console.log(this.experience.world.libraryRoom);

        // Methods binding
        this.onLinkClickBound = this.onLinkClick.bind(this)

        this.keyframes = []

        this.getElements()
        this.events()
    }

    getElements()
    {
        this.el = document.querySelector('.navigation')
        this.links = document.querySelectorAll('.navigation__link')
    }

    events()
    {
        this.links.forEach(link => {
            link.addEventListener('click', this.onLinkClickBound)
        })
    }

    onLinkClick()
    {

    }



    destroy()
    {
        this.links.forEach(link => {
            link.removeEventListener('click', this.onLinkClickBound)
        })
    }
}