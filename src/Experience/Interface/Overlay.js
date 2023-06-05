import gsap from 'gsap'
import EventEmitter from '../Utils/EventEmitter'
import Pager from './Book/Pager'
import BookContent from './Book/BookContent'

export default class Overlay extends EventEmitter {
    constructor()
    {
        super()
        
        this.pager = null 
        this.bookContent = null 

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
        // Reset pager on init
        this.pager = null
        this.pager = new Pager()
    }

    initBookContent(bookId, bookColor)
    {
        // Reset book content on init
        this.bookContent = null
        this.bookContent = new BookContent(bookId, bookColor)
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
        this.trigger('closeBook', [this.bookContent])
        gsap.to(this.el, {
            alpha: 0,
            pointerEvents: 'none'
        })
    }
}