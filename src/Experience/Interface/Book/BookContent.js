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

        this.getImagesPath()
        this.getElements()
        this.onEnterCompleted()
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

    showLeftPageContent()
    {
        if (this.pager.currentPage === 1 || this.pager.currentPage === 0) {
            this.leftPageContent.innerHTML = ''
            gsap.to(this.leftPageBorder, { alpha: 0 })
            return
        } 

        const startingChapter = document.createElement('div')
        const title = document.createElement('div')
        const text = document.createElement('div')
        
        startingChapter.classList.add('book__starting-chapter')
        
        title.classList.add('book__starting-chapter__title')
        title.innerHTML = this.stories[this.pager.currentPage - 2].title

        startingChapter.appendChild(title)

        this.leftPageContent.innerHTML = startingChapter.outerHTML
        gsap.to(this.leftPageBorder, { alpha: 1 })
    }

    showRightPageContent()
    {
        if (this.pager.currentPage === 0) {
            this.rightPageContent.innerHTML = ''
            return 
        } else if (this.pager.currentPage === 1) {
            const title = document.createElement('div')
            title.classList.add('book__title')
            title.innerHTML = this.book.title
            this.rightPageContent.innerHTML = title.outerHTML
        } else {
            const text = document.createElement('div')
            text.classList.add('book__text')
            this.pager.currentPage === 2 && text.classList.add('after-starting-chapter')
            text.innerHTML = this.stories[this.pager.currentPage - 2].content
            this.rightPageContent.innerHTML = text.outerHTML
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

            setTimeout(() => {
                this.fadeIn()
            }, 0);
        }
    }

    onEnterCompleted() {}

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