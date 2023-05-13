import Pager from './Pager'
import gsap from 'gsap'
/**
 * @class BookContent
 * @description Handle the book content
 */
export default class BookContent {
    constructor()
    {
        this.init()
    }

    init()
    {
        this.pager = new Pager()
        this.isBookOpen = false
        this.isLastPage = false
        this.pageIndex = -1

        /**
         * Images management
         */
        this.images = []
        this.imagesCount = 120
        this.imagesKeyFrames = [41, 81, 99]
        this.lastImageFrame = 1

        // Loops to handle the images
        this.intervalNextPage = null
        this.intervalPreviousPage = null

        this.getImagesPath()
        this.getElements()
        this.onEnterCompleted()

        // When the pager change page
        this.pager.on('changePage', (status) => {
            if (status === 'next') {
                this.nextPage()
            } else {
                this.previousPage()
            }
        })
    }

    getImagesPath()
    {
        for (let i = 1; i <= this.imagesCount; i++) {
            let id = '0' + i
            if (i < 10) id = '00' + i
            if (i >= 100) id = i
            this.images.push(`/images/book/Livre_30${id}.webp`)
        }
    }

    getElements()
    {
        this.el = document.querySelector('.book__content')
        this.image = document.querySelector('.book__image')
        this.leftPage = this.el.querySelector('.book__left-page')
        this.rightPage = this.el.querySelector('.book__right-page')
    }

    events()
    {
        
    }

    nextPage()
    {
        // If first opening of the book
        if (!this.isBookOpen) this.isBookOpen = true

        this.pageIndex++ 

        // If last image showed was the last animation available
        if(this.lastImageFrame >= this.imagesKeyFrames[this.imagesKeyFrames.length - 1]) {
            this.pageIndex = this.imagesKeyFrames.length - 1
            this.lastImageFrame = 81
        }
        
        // Loop to show images sequence
        clearInterval(this.intervalNextPage)
        this.intervalNextPage = setInterval(() => {
            if (this.lastImageFrame === this.imagesKeyFrames[this.pageIndex]) clearInterval(this.intervalNextPage)
            this.image.src = this.images[this.lastImageFrame]
            this.lastImageFrame++
        }, 24);
    }

    previousPage()
    {
        // If first page
        console.log(this.lastImageFrame);
        if (this.lastImageFrame === 1) {
            this.isBookOpen = false
            return
        }

        if (this.isBookOpen) { 
            // TODO: handle first page
            this.pageIndex--
            
            clearInterval(this.intervalNextPage)
            this.intervalPreviousPage = setInterval(() => {
                if (this.lastImageFrame === 1) clearInterval(this.intervalPreviousPage)
                if (this.lastImageFrame === this.imagesKeyFrames[this.pageIndex]) clearInterval(this.intervalPreviousPage)
                this.lastImageFrame--
                this.image.src = this.images[this.lastImageFrame]
            }, 24);
        }
    }

    onEnterCompleted() {}

    fadeIn() {}

    fadeOut() {}

    destroy() {
        this.pager.destroy()

        this.isBookOpen = false
        this.isLastPage = false
        this.pageIndex = -1
        this.image.src = this.images[0]
        this.lastImageFrame = 1

        clearInterval(this.intervalNextPage)
        clearInterval(this.intervalPreviousPage)
    }
}