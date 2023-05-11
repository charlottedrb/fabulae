import gsap from 'gsap'
import EventEmitter from '../Utils/EventEmitter'
import Pager from './Book/Pager'

export default class Overlay extends EventEmitter {
    constructor()
    {
        super()
        
        this.pager = null 
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

    initPager()
    {
        this.pager = new Pager()
    }
    
    events()
    {
        this.close.addEventListener('click', this.onCloseClick.bind(this))
    }

    show() 
    {
        gsap.to(this.el, {
            alpha: 1,
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