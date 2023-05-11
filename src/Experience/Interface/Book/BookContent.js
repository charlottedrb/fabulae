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

        this.keyPoints = [3000, 1000]

        this.getElements()
        this.onEnterCompleted()

        this.pager.on('changePage', (status) => {
            console.log(status);
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
        this.video = this.el.querySelector('.book__video')
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
        this.playVideo()

        setTimeout(() => {
            this.pauseVideo()
        }, this.keyPoints[this.pageIndex])
    }

    previousPage()
    {
        if (this.isBookOpen) { 
            // TODO: handle first page 
            this.video.currentTime -= this.keyPoints[this.pageIndex]
        }
    }

    playVideo()
    {
        this.video.play()
    }

    pauseVideo()
    {
        this.video.pause()
    }

    onEnterCompleted()
    {

    }

    fadeIn()
    {

    }

    fadeOut()
    {

    }
}