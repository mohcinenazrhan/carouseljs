/**
 * Class Carousel
 */
export default class Carousel {

    /**
     * @param {HTML element} element 
     * @param {Object} options : slidesToScroll Nombre d'élements à faire défiler"
     * @param {Object} options : slidesVisible nombre d'élements visible dans un slide"
     */
    constructor(element, options = {}) {
        this.element = element
        this.options = Object.assign({}, {
            slidesToScroll: 1,
            slidesVisible: 1
        }, options)

        this.children = [].slice.call(element.children)
        let ratio = this.children.length / this.options.slidesVisible

        let root = this.createDivWithClass('carousel')
        let container = this.createDivWithClass('carousel__container')
        container.style.width = (ratio * 100) + "%"

        root.appendChild(container)
        this.element.appendChild(root)
        this.children.forEach(child => {
            let item = this.createDivWithClass('carousel__item')
            item.style.width = ((100 / this.options.slidesVisible) / ratio) + "%"
            item.appendChild(child)
            container.appendChild(item)
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
}