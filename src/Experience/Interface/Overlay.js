import gsap from 'gsap'
import EventEmitter from '../Utils/EventEmitter'

export default class Overlay extends EventEmitter {
    constructor()
    {
        super()
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

    show() 
    {
        gsap.to(this.el, {
            alpha: 0.5,
            pointerEvents: 'auto'
        })
    }

    onCloseClick()
    {
        this.trigger('closeBook')
        gsap.to(this.el, {
            alpha: 0,
            pointerEvents: 'none'
        })
    }
}