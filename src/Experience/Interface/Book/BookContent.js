import Splitting from 'splitting'
import DataManager from '../../Data/DataManager'
import Pager from './Pager'
import gsap from 'gsap'
import InterfaceUI from '../../InterfaceUI'
/**
 * @class BookContent
 * @description Handle the book content
 */
export default class BookContent {
    constructor(bookId)
    {
        this.id = bookId
        this.init()
    }

    /**
     * Functional methods
     */

    init()
    {
        /**
         * Data management
         */
        this.dataManager = new DataManager()
        this.getBookContent()

        this.interface = new InterfaceUI()
        this.pager = this.interface.overlay.pager
        this.isBookOpen = false
        this.isLastPage = false
        this.pageIndex = -1
        this.textOverflowing = false
        this.textDiv = null

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

        this.animation = gsap.timeline()

        // Change to disable overflow scroll on content
        this.overflowScroll = true

        this.getImagesPath()
        this.getElements()
        this.getBookContent()

        // When the pager change page
        this.pager.on('changePage', (status) => {
            if (status === 'next') {
                this.nextPage()
            } else {
                this.previousPage()
            }
        })
    }

    getElements()
    {
        this.el = document.querySelector('.book__content')
        this.image = document.querySelector('.book__image')

        /**
         * Left page
         */
        this.leftPage = this.el.querySelector('.book__left-page')
        this.leftPageContent = this.el.querySelector('.book__left-page__content')
        this.leftPageBorder = this.leftPage.querySelector('.book__page-border')

        /**
         * Right page
         */
        this.rightPage = this.el.querySelector('.book__right-page')
        this.rightPageContent = this.el.querySelector('.book__right-page__content')
    }

    getBookContent()
    {
        this.book = this.dataManager.getBookById(this.id)
        this.stories = this.dataManager.getStoriesByBookId(this.id)
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

    destroy() {
        this.pager.destroy()

        this.isBookOpen = false
        this.isLastPage = false
        this.pageIndex = -1
        this.image.src = this.images[0]
        this.lastImageFrame = 1

        this.leftPageContent.innerHTML = ''
        this.rightPageContent.innerHTML = ''
        gsap.to([this.leftPageBorder, this.rightPageBorder], { alpha: 0 })

        clearInterval(this.intervalNextPage)
        clearInterval(this.intervalPreviousPage)
    }

    /**
     * Page management and events
     */

    /** Show empty or story title */
    showLeftPageContent()
    {
        if (this.pager.currentPage === 1 || this.pager.currentPage === 0) {
            this.leftPageContent.innerHTML = ''
            gsap.to(this.leftPageBorder, { alpha: 0 })
            return
        } 

        // Creating necessary HTML elements

        if (!this.overflowScroll && this.textOverflowing) {
            const text = document.createElement('div')
            text.classList.add('book__text')
            text.innerHTML = this.textDiv.innerHTML
            text.style.marginTop = -this.rightPageContent.clientHeight + 'px'

            this.leftPageContent.innerHTML = text.outerHTML
            gsap.to(this.leftPageBorder, { alpha: 1 })

            // Get freshly created div in DOM to check if it's overflowing
            this.textDiv = this.leftPageContent.querySelector('.book__text')
            this.checkOverflowing(this.leftPageContent)
            return
        } else {
            // If not overflowing, we add the next chapter title
            const startingChapter = document.createElement('div')
            const title = document.createElement('div')
            
            startingChapter.classList.add('book__starting-chapter')
            
            title.classList.add('book__starting-chapter__title')
            title.innerHTML = this.stories[this.pager.currentPage - 2].title
            
            startingChapter.appendChild(title)

            this.leftPageContent.innerHTML = startingChapter.outerHTML
            gsap.to(this.leftPageBorder, { alpha: 1 })
        }
    }

    /** Show book title or story content */
    showRightPageContent()
    {
        // If the book is closed
        if (this.pager.currentPage === 0) {
            this.rightPageContent.innerHTML = ''
            return 

        // If it's the first page
        } else if (this.pager.currentPage === 1) {
            const title = document.createElement('div')
            title.classList.add('book__title')
            title.innerHTML = this.book.title
            this.rightPageContent.innerHTML = title.outerHTML

        // Classic content page
        } else {
            const text = document.createElement('div')
            text.classList.add('book__text')
            // this.pager.currentPage === 2 && text.classList.add('after-starting-chapter')
            text.innerHTML = this.stories[this.pager.currentPage - 2].content
            this.rightPageContent.innerHTML = text.outerHTML

            // Get freshly created div in DOM to check if it's overflowing
            this.textDiv = this.rightPageContent.querySelector('.book__text')

            !this.overflowScroll && this.checkOverflowing(this.rightPageContent)
        }
    }

    nextPage()
    {   
        // If first opening of the book
        if (!this.isBookOpen) this.isBookOpen = true
        
        this.pageIndex++ 

        this.fadeOut()

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

        // Show the content
        setTimeout(() => {
            this.fadeIn()
        }, 0);
    }

    previousPage()
    {     
        if (this.isBookOpen) { 
            this.pageIndex--

            this.fadeOut()

            clearInterval(this.intervalPreviousPage)
            this.intervalPreviousPage = setInterval(() => {
                if (this.lastImageFrame === 1) clearInterval(this.intervalPreviousPage)
                if (this.lastImageFrame === this.imagesKeyFrames[this.pageIndex]) clearInterval(this.intervalPreviousPage)
                this.lastImageFrame--
                this.image.src = this.images[this.lastImageFrame]
            }, 24);

            // If first page was open, we close the book
            if (this.lastImageFrame === 1 || this.pager.currentPage === 0) {
                this.isBookOpen = false
                return
            }

            // Show the content
            setTimeout(() => {
                this.fadeIn()
            }, 0);
        }
    }

    checkOverflowing(container)
    {
        if (this.textDiv.scrollHeight > container.clientHeight) {
            this.textOverflowing = true
        } else {
            this.textOverflowing = false
        }
    }

    /**
     * Animations
     */
    fadeIn() {
        this.animation.to([this.leftPage, this.rightPage], {
            alpha: 1,
            duration: 0.5,
            ease: 'power2.in'
        })
    }

    fadeOut() {
        this.animation.to([this.leftPage, this.rightPage], {
            alpha: 0,
            duration: 0.7,
            ease: 'expo.out',
            onComplete: () => {
                this.showLeftPageContent()
                this.showRightPageContent()
            }  
        })
    }
}