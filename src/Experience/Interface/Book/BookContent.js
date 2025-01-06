import gsap from "gsap";
import InterfaceUI from "../../InterfaceUI";
import Experience from "../../Experience";
/**
 * @class BookContent
 * @description Handle the book content
 */
export default class BookContent {
    constructor(bookId, bookColor) {
        this.id = bookId;
        this.color = bookColor;
        this.init();
    }

    /**
     * Functional methods
     */
    init() {
        /**
         * Data management
         */
        this.experience = new Experience();
        this.dataManager = this.experience.dataManager;

        this.interface = new InterfaceUI();
        this.pager = this.interface.overlay.pager;
        this.isBookOpen = false;
        this.isLastPage = false;
        this.boardIndex = 0;
        this.textOverflowing = false;
        this.textDiv = null;

        /**
         * Images management
         */
        this.images = [];
        this.storiesVideos = [];
        this.imagesCount = 120;
        this.imagesKeyFrames = [41, 81, 99];
        this.lastImageFrame = 1;
        this.frameIndex = -1

        /**
         * Sound management
         */
        this.pageTurnSound = new Audio("/sounds/Book/page-turning.mp3");
        this.pageTurnSound.volume = 0.8

        // Loops to handle the images
        this.intervalNextPage = null;
        this.intervalPreviousPage = null;
        this.formattedPages = [];
        this.boardHasStoryTitle = false;

        this.animation = gsap.timeline();

        this.getImagesPath();
        this.getElements();
        this.getBookContent();

        // When the pager change page
        this.pager.on("changePage", (status) => {
            if (status === "next") {
                this.nextPage();
            } else {
                this.previousPage();
            }
        });
    }

    getElements() {
        this.el = document.querySelector(".book__content");
        this.image = document.querySelector(".book__image");
        if (this.color !== 'blue') this.image.src = this.images[0];

        /**
         * Left page
         */
        this.leftPage = this.el.querySelector(".book__left-page");
        this.leftPageContent = this.el.querySelector(
            ".book__left-page__content"
        );
        this.leftPageBorderTitle = this.leftPage.querySelector(".book__page-border.border__style-title");
        this.leftPageBorderText = this.leftPage.querySelector(".book__page-border.border__style-text");

        /**
         * Right page
         */
        this.rightPage = this.el.querySelector(".book__right-page");
        this.rightPageContent = this.el.querySelector(
            ".book__right-page__content"
        );
    }

    getBookContent() {
        this.book = this.dataManager.getBookById(this.id);
        this.stories = this.dataManager.getStoriesByBookId(this.id);
        this.author = this.dataManager.getAuthorById(this.book.authorId);
        this.prepareContent();
    }

    prepareContent() {
        // Add author infos
        this.formattedPages.push("");

        // Add book title
        this.formattedPages.push(this.book.title);

        // Add stories' titles & content
        this.stories.forEach((story) => {
            this.formattedPages.push(story.title);
            this.cutText(story.content);
            this.formattedPages.push(story.visual)
        });
    }

    cutText(text) {
        // Max chars per page
        const MAX_LENGTH = 530;
        const words = text.split(" ");
        let currentPage = "";

        for (let i = 0; i < words.length; i++) {
            const word = words[i];

            if (currentPage.length + word.length <= MAX_LENGTH) {
                currentPage += (currentPage.length > 0 ? " " : "") + word;
            } else {
                // currentPage += "</p><p>";
                this.formattedPages.push(currentPage);
                currentPage = word;
            }
        }

        if (currentPage.length > 0) {
            this.formattedPages.push(currentPage);
        }
    }

    showNextContent()
    {
        let content = {
            left: null,
            right: null
        }

        for (let i = this.boardIndex; i < this.boardIndex + 2;  i++) {
            const page = this.setPageElements(i);
            if (page) i % 2 === 0 ? content.left = page : content.right = page
        }

        this.leftPageContent.innerHTML = content.left && content.left.outerHTML;
        this.rightPageContent.innerHTML = content.right && content.right.outerHTML;
        this.boardIndex += 2;
        this.boardHasStoryTitle = false;
    }

    showPreviousContent()
    {
        let content = {
            left: null,
            right: null
        }

        this.boardIndex -= 2;
        
        for (let i = this.boardIndex - 1; i > this.boardIndex - 3;  i--) {
            const page = this.setPageElements(i);
            i % 2 === 0 ? content.left = page : content.right = page
        }
        
        this.leftPageContent.innerHTML = content.left && content.left.outerHTML;
        this.rightPageContent.innerHTML = content.right && content.right.outerHTML;
        this.boardHasStoryTitle = false;
    }

    setPageElements(i) {
        let content = ''
        const startingChapter = document.createElement("div");
        
        
        if (i === 0) {
            // Second cover
            document.querySelector('.book__author-infos__name').innerHTML = `${this.author.firstName} ${this.author.lastName}`
            document.querySelector('.book__author-infos__birthdate').innerHTML = this.author.birthdate
            document.querySelector('.book__author-infos').style.opacity = 1
            document.querySelector('.book__author-infos__image').src = `/images/authors/${this.author.imagePath}`
            content = document.querySelector('.book__author-infos').outerHTML;
            this.leftPageBorderTitle.style.opacity = '0'
        } else if (i === 1) {
            // Show book's title
            this.leftPageBorderTitle.style.opacity = '0'
            this.leftPageBorderText.style.opacity = '0'
            const title = document.createElement("div");

            startingChapter.classList.add("book__starting-chapter");

            title.classList.add("book__starting-chapter__title");
            title.innerHTML = this.formattedPages[i];

            startingChapter.appendChild(title);
            content = startingChapter;
        } else if (this.formattedPages[i] && (this.formattedPages[i].includes('<p>') || this.formattedPages[i].includes('</p>'))) {
            // Show story content
            !this.boardHasStoryTitle && (this.leftPageBorderTitle.style.opacity = '0')
            !this.boardHasStoryTitle && (this.leftPageBorderText.style.opacity = '1')
            const text = document.createElement("div");

            text.classList.add("book__text");
            text.innerHTML = this.formattedPages[i];
            content = text;
        } else if (typeof this.formattedPages[i] === 'undefined') {
            // Show nothing
            return
        } else if (this.formattedPages[i].includes('/videos/stories/')) {
            // Show generated animated image 
            const video = document.createElement("video");

            video.classList.add("book__video");
            video.setAttribute("autoplay", true);
            video.setAttribute("loop", true);
            video.setAttribute("muted", true);
            video.setAttribute("playsinline", true);
            video.setAttribute("src", this.formattedPages[i]);

            content = video
        } else {
            // Show story title
            this.boardHasStoryTitle = true
            
            this.boardHasStoryTitle && (this.leftPageBorderTitle.style.opacity = '1')
            this.boardHasStoryTitle && (this.leftPageBorderText.style.opacity = '0')
            const title = document.createElement("div");

            startingChapter.classList.add("book__starting-chapter");

            title.classList.add("book__starting-chapter__title");
            title.innerHTML = this.formattedPages[i];

            startingChapter.appendChild(title);
            content = startingChapter;
        }

        // Remove author infos if not on first board
        if (i !== 0 && i !== 1) { document.querySelector('.book__author-infos').style.opacity = 0 }

        return content
    }

    getImagesPath() {
        for (let i = 1; i <= this.imagesCount; i++) {
            let id = "0" + i;
            if (i < 10) id = "00" + i;
            if (i >= 100) id = i;
            this.images.push(`/images/book/${this.color}/Livre_0${id}.webp`);
        }
    }

    destroy() {
        this.experience = null;
        this.dataManager = null;
        this.interface = null;
        this.pager = null;
        this.isBookOpen = false;
        this.isLastPage = false;
        this.boardIndex = 0;
        this.textOverflowing = false;
        this.textDiv = null;

        /**
         * Images management
         */
        this.image.src = this.images[0];
        this.lastImageFrame = 1;
        this.frameIndex = -1

        // Loops to handle the images
        clearInterval(this.intervalNextPage);
        clearInterval(this.intervalPreviousPage);
        this.intervalNextPage = null;
        this.intervalPreviousPage = null;
        this.boardHasStoryTitle = false;

        this.animation = gsap.timeline();

        this.leftPageContent.innerHTML = "";
        this.rightPageContent.innerHTML = "";
        gsap.to([this.leftPageBorderTitle, this.leftPageBorderText, this.rightPage], { alpha: 0 });
    }

    /**
     * Page management and events
     */

    /**
     * Page animation when click on next
     */
    nextPage() {
        // If first opening of the book
        if (!this.isBookOpen) this.isBookOpen = true;
        
        if (this.formattedPages.length - 2 <= this.boardIndex) {
            if (this.pager) this.pager.disable()
        }
        this.frameIndex++;
        this.pageTurnSound.play()

        this.fadeOut('next');

        // If last image showed was the last animation available
        if (
            this.lastImageFrame >=
            this.imagesKeyFrames[this.imagesKeyFrames.length - 1]
        ) {
            this.frameIndex = this.imagesKeyFrames.length - 1;
            this.lastImageFrame = 81;
        }

        // Loop to show images sequence
        clearInterval(this.intervalNextPage);
        this.intervalNextPage = setInterval(() => {
            if (this.lastImageFrame === this.imagesKeyFrames[this.frameIndex])
                clearInterval(this.intervalNextPage);
            this.image.src = this.images[this.lastImageFrame];
            this.lastImageFrame++;
        }, 24);

        // Show the content
        setTimeout(() => {
            this.fadeIn();
        }, 0);
    }

    /**
     * Page animation when click on previous
     */
    previousPage() {
        if (this.isBookOpen) {
            this.frameIndex--;
            this.pageTurnSound.play()

            if (this.pager && this.pager.disabled) this.pager.enable()

            this.fadeOut('previous');
            
            if (this.boardIndex >= 6) {
                this.frameIndex = this.imagesKeyFrames.length - 2;
                this.lastImageFrame = 99;
            }

            clearInterval(this.intervalPreviousPage);
            this.intervalPreviousPage = setInterval(() => {
                if (this.lastImageFrame === 1)
                    clearInterval(this.intervalPreviousPage);
                if (this.lastImageFrame === this.imagesKeyFrames[this.frameIndex])
                    clearInterval(this.intervalPreviousPage);
                    
                this.lastImageFrame--;
                this.image.src = this.images[this.lastImageFrame];
            }, 24);

            // If first page was open, we close the book
            if (this.lastImageFrame === 1 || this.pager.currentPage === 0) {
                this.isBookOpen = false;
                return;
            }

            // Show the content
            setTimeout(() => {
                this.fadeIn();
            }, 0);
        }
    }

    /**
     * Animations
     */
    fadeIn() {
        this.animation.to([this.leftPage, this.rightPage], {
            alpha: 1,
            duration: 0.3,
            ease: "power2.in",
        });
    }

    fadeOut(status) {
        this.animation.to([this.leftPage, this.rightPage], {
            alpha: 0,
            duration: 0.5,
            ease: "expo.out",
            onComplete: () => {
                if (status === 'next') {
                    this.showNextContent()
                } else {
                    this.showPreviousContent()
                }
            },
        });
    }
}
