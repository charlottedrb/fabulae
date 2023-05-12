import Pager from './Pager'
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

        this.images = []
        this.imagesCount = 121
        this.imagesKeyFrames = [42, 82, 100]

        this.getImagesPath()
        this.getElements()
        this.onEnterCompleted()

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
            this.images.push(`/images/book/Livre_300${i < 10 ? '0' + i : i}.webp`)
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
        // TODO: handle last page
        if (!this.isBookOpen) this.isBookOpen = true
        this.pageIndex++ 
        this.image.src = this.images[this.pageIndex]
    }

    previousPage()
    {
        if (this.isBookOpen) { 
            // TODO: handle first page
            this.pageIndex--
            this.image.src = this.images[this.pageIndex]
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
    }
}