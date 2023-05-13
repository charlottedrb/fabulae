import gsap from 'gsap'
import { throttle } from 'debounce-throttle'
import Sizes from '../../Utils/Sizes'
import EventEmitter from '../../Utils/EventEmitter'
 
export default class Pager extends EventEmitter {
    constructor()
    {
        super()

        this.sizes = new Sizes()

        this.init()
    }

    bindMethods()
    {
        // this.onMouseMove = throttle(100, () => this.onMouseMove().bind(this))
    }

    init()
    {
        this.middleScreen = this.sizes.width / 2
        this.mouse = {
            x: null,
            y: null
        }
        this.status = null

        this.getElements()
        this.bindMethods()
        this.events()
    }

    getElements()
    {
        this.el = document.querySelector('.pager')
        this.guide = this.el.querySelector('.pager__guide')
        this.line = this.el.querySelector('.pager__line')
        this.previous = this.el.querySelector('.pager__previous')
        this.next = this.el.querySelector('.pager__next')
    }

    events()
    {
        window.addEventListener('mousemove', this.onMouseMove.bind(this))
        window.addEventListener('click', this.onClick.bind(this))
    }

    onClick()
    {
        if (this.status === null) return

        this.trigger('changePage', [this.status])
    }

    onMouseMove(e)
    {
        this.mouse.x = e.clientX / this.sizes.width * 2 - 1
        this.mouse.y = -(e.clientY / this.sizes.height) * 2 - 1

        if (this.mouse.x > 0.30 || this.mouse.x < -0.30)  return 
        
        if (this.mouse.x > 0.20) {
            gsap.to(this.next, { alpha: 1 })
            this.status = 'next'
        } else if (this.mouse.x < -0.20) {
            gsap.to(this.previous, { alpha: 1 })
            this.status = 'previous'
        } else {
            gsap.to([this.next, this.previous], { alpha: 0 })
            this.status = null
        }

        const rotation = this.mouse.x * 90
        
        gsap.to(this.guide, {
            rotate: rotation,
            x: this.mouse.x * 100,
        })

        gsap.to(this.line, {
            rotate: 90 + rotation,
        })
    }

    destroy()
    {
        window.removeEventListener('mousemove', this.onMouseMove)
        window.removeEventListener('click', this.onClick)
        this.mouse = {
            x: null,
            y: null
        }
        this.status = null
    }
}