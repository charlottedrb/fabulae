import Experience from "../Experience";

export default class Navigation {
    constructor()
    {
        this.experience = new Experience()
        this.libraryRoom = this.experience.world.libraryRoom

        // Methods binding
        this.onLinkClickBound = (i) => this.onLinkClick.bind(this, i)

        this.keyframes = [10.0, 15.0, 25.0, 35.0]

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
        this.links.forEach((link, i) => {
            link.addEventListener('click', this.onLinkClickBound(i))
        })
    }

    onLinkClick(i)
    {
        if (i === 0) {
            this.libraryRoom.cameraAction.time = this.keyframes[i]
            setTimeout(() => {
                this.libraryRoom.cameraAction.stop()
            }, 0);
        } else {
            this.libraryRoom.animMixer.setTime(this.keyframes[i] - this.keyframes[i - 1])
            this.libraryRoom.animMixer.update(0)
        }
    }



    destroy()
    {
        this.experience = null 
        this.libraryRoom = null
        this.onLinkClickBound = null

        this.links.forEach(link => {
            link.removeEventListener('click', this.onLinkClickBound)
        })
    }
}