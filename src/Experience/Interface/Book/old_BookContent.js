import Pager from './Pager'
export default class old_BookContent {
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

        this.keyPoints = [3000, 1200]
        this.intervalRewind = null

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
            this.rewindVideo(this.keyPoints[this.pageIndex])
            this.pageIndex--
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

        this.restartVideo()
    }

    /**
     * Video functions 
     */

    playVideo() { this.video.play() }

    pauseVideo() { this.video.pause() }

    restartVideo() { this.video.currentTime = 0 }

    rewindVideo(duration)
    {
        console.log(duration);

        clearInterval(this.intervalRewind);
        var startSystemTime = new Date().getTime();
        var startVideoTime = this.video.currentTime;
        this.video.playbackRate = 1.0;
        
        this.intervalRewind = setInterval(() => {
            this.video.playbackRate = 1.0;
            if(this.video.currentTime == 0){
                clearInterval(this.intervalRewind);
                this.video.pause();
            } else {
                var elapsed = new Date().getTime() - startSystemTime;
                console.log(elapsed);
                if (elapsed >= duration) {
                    clearInterval(this.intervalRewind);
                    this.video.pause();
                }
                this.video.currentTime = Math.max(startVideoTime - elapsed * 1.0 / 1000.0, 0);
            }
        }, 10);
    }
}