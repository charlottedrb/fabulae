import gsap from 'gsap'

export default class Overlay {
    constructor()
    {
        this.getElements()
        this.init()
        this.events()
    }

    getElements() 
    {
        this.el = document.querySelector('.overlay')
        this.close = document.querySelector('.overlay-close')
    }

    
    init()
    {
        
    }
    
    events()
    {
        this.close.addEventListener('click', this.onCloseClick.bind(this))
    }

    onCloseClick()
    {
        console.log('coucou');
        gsap.to(this.el, {
            alpha: 0
        })
    }
}