/**
 * Class Carousel
 */
export default class Carousel {

    /**
 * @param {HTML element} element 
 * @param {Object} [options.slidesToScroll=1] : slidesToScroll Number of items to scroll
 * @param {Object} [options.slidesVisible=1] : slidesVisible number of elements visible in a slide
 * @param {boolean} [options.loop=false] : loop slider
 */
    constructor(element, options = {}) {
        this.element = element
        this.options = Object.assign({}, {
            slidesToScroll: 1,
            slidesVisible: 1,
            loop: false
        }, options)

        this.moveCallBacks = []
        this.isMobile = false

        let children = [].slice.call(element.children)
        this.currentItem = 0;

        this.root = this.createDivWithClass('carousel')
        this.container = this.createDivWithClass('carousel__container')

        this.root.setAttribute('tabindex', '0')
        this.root.appendChild(this.container)
        this.element.appendChild(this.root)

        this.items = children.map(child => {
            let item = this.createDivWithClass('carousel__item')
            item.appendChild(child)
            this.container.appendChild(item)
            return item
        });

        this.setStyle()
        this.createNavigation()
        this.moveCallBacks.forEach(cb => cb(this.currentItem))

        this.onWindowResize()
        window.addEventListener('resize', this.onWindowResize.bind(this))

        this.root.addEventListener('keyup', e => {
            if (e.key === 'ArrowRight' || e.key === 'Right') this.next()
            else if (e.key === 'ArrowLeft' || e.key === 'Left') this.prev()

        })
    }

    /**
     * Set style width to carousel container and items
     */
    setStyle() {
        let ratio = this.items.length / this.slidesVisible
        this.container.style.width = (ratio * 100) + "%"
        this.items.forEach(item => {
            item.style.width = ((100 / this.slidesVisible) / ratio) + "%"
        });
    }

    /**
     * @param {string} className
     * @returns {HTMLElement} 
     */
    createDivWithClass(className) {
        let div = document.createElement('div')
        div.setAttribute('class', className)
        return div
    }

    /**
     * Create navigation carousel Next and Prev
     */
    createNavigation() {
        let nextButton = this.createDivWithClass('carousel__next')
        let prevButton = this.createDivWithClass('carousel__prev')
        this.root.appendChild(nextButton)
        this.root.appendChild(prevButton)

        nextButton.addEventListener('click', this.next.bind(this))
        prevButton.addEventListener('click', this.prev.bind(this))

        if (this.options.loop === true) { return }
        this.onMove(index => {
            if (index === 0) {
                prevButton.classList.add('carousel__prev--hidden')
            } else {
                prevButton.classList.remove('carousel__prev--hidden')
            }

            if (this.items[this.currentItem + this.slidesVisible] === undefined) {
                nextButton.classList.add('carousel__next--hidden')
            } else {
                nextButton.classList.remove('carousel__next--hidden')
            }
        })

    }

    next() {
        this.gotoItem(this.currentItem + this.slidesToScroll)
    }

    prev() {
        this.gotoItem(this.currentItem - this.slidesToScroll)
    }

    /**
     * Moves the carousel to the targeted item
     * @param {number} index 
     */
    gotoItem(index = 0) {

        if (index < 0) {
            if (this.options.loop) index = this.items.length - this.slidesVisible
            else return
        } else if (index >= this.items.length
            || (this.items[this.currentItem + this.slidesVisible] === undefined && index > this.currentItem)) {
            if (this.options.loop) index = 0
            else return
        }

        let translateX = index * -100 / this.items.length
        this.container.style.transform = "translate3d(" + translateX + "%, 0, 0)"
        this.currentItem = index

        this.moveCallBacks.forEach(cb => cb(index))
    }

    /**
     * 
     * @param {callback} callBack 
     */
    onMove(callBack) {
        this.moveCallBacks.push(callBack)
    }

    /**
     * @returns {number}
     */
    get slidesToScroll() {
        return this.isMobile ? 1 : this.options.slidesToScroll
    }

    /**
     * @returns {number}
     */
    get slidesVisible() {
        return this.isMobile ? 1 : this.options.slidesVisible
    }

    /**
     * Adapt carousel to winsow screen
     */
    onWindowResize() {
        let mobile = window.innerWidth < 800
        if (mobile !== this.isMobile) {
            this.isMobile = mobile
            this.setStyle()
            this.moveCallBacks.forEach(cb => cb(this.currentItem))
        }
    }
}