import CarouselTouchPlugin from './CarouselTouchPlugin';

/**
 * Class Carousel
 */
export default class Carousel {
	/**
     * @param {HTML element} element 
     * @param {Object} [options.slidesToScroll=1] : slidesToScroll Number of items to scroll
     * @param {Object} [options.slidesVisible=1] : slidesVisible number of elements visible in a slide
     * @param {boolean} [options.loop=false] : loop slider
     * @param {boolean} [options.pagination=false] : pagination slider
     * @param {boolean} [options.navigation=true] : navigation slider
     * @param {boolean} [options.infinite=false] : infinite loop
     */
	constructor(element, options = {}) {
		this.element = element;
		this.options = Object.assign(
			{},
			{
				slidesToScroll: 1,
				slidesVisible: 1,
				loop: false,
				navigation: true,
				pagination: false,
				infinite: false
			},
			options
		);

		if (this.options.loop && this.options.infinite) {
			throw new Error('Un carousel ne peut etre à la fois en boucle et en infinie');
		}

		this.offset = 0;
		this.moveCallBacks = [];
		this.isMobile = false;
		this.fromAction = false; // to reset Infinite only if the transition is from the action next/prev

		let children = [].slice.call(element.children);
		this.currentItem = 0;

		this.root = this.createDivWithClass('carousel');
		this.container = this.createDivWithClass('carousel__container');

		this.root.setAttribute('tabindex', '0');
		this.root.appendChild(this.container);
		this.element.appendChild(this.root);

		this.items = children.map((child) => {
			let item = this.createDivWithClass('carousel__item');
			item.appendChild(child);
			this.container.appendChild(item);
			return item;
		});

		if (this.options.infinite) {
			//this.offset = this.options.slidesVisible * 2 //  - 1
			this.offset = this.options.slidesVisible + this.options.slidesToScroll;
			if (this.offset > children.length)
				console.error("Vous n'avez pas assez d'élément dans le carousel", element);

			this.items = [
				...this.items.slice(this.items.length - this.offset).map((item) => item.cloneNode(true)),
				...this.items,
				...this.items.slice(0, this.offset).map((item) => item.cloneNode(true))
			];

			this.currentItem = this.offset;
			this.gotoItem(this.offset);
		}

		this.items.forEach((item) => this.container.appendChild(item));

		this.setStyle();
		if (this.options.navigation) this.createNavigation();
		if (this.options.pagination) this.createPagination();

		this.moveCallBacks.forEach((cb) => cb(this.currentItem));

		this.onWindowResize();
		window.addEventListener('resize', this.onWindowResize.bind(this));

		this.root.addEventListener('keyup', (e) => {
			if (e.key === 'ArrowRight' || e.key === 'Right') this.next();
			else if (e.key === 'ArrowLeft' || e.key === 'Left') this.prev();
		});

		if (this.options.infinite) this.container.addEventListener('transitionend', this.resetInfinite.bind(this));

		new CarouselTouchPlugin(this);
	}

	/**
     * Set style width to carousel container and items
     */
	setStyle() {
		let ratio = this.items.length / this.slidesVisible;
		this.container.style.width = ratio * 100 + '%';
		this.items.forEach((item) => {
			item.style.width = 100 / this.slidesVisible / ratio + '%';
		});
	}

	/**
     * @param {string} className
     * @returns {HTMLElement} 
     */
	createDivWithClass(className) {
		let div = document.createElement('div');
		div.setAttribute('class', className);
		return div;
	}

	/**
     * Create navigation carousel Next and Prev
     */
	createNavigation() {
		let nextButton = this.createDivWithClass('carousel__next');
		let prevButton = this.createDivWithClass('carousel__prev');
		this.root.appendChild(nextButton);
		this.root.appendChild(prevButton);

		nextButton.addEventListener('click', this.next.bind(this));
		prevButton.addEventListener('click', this.prev.bind(this));

		if (this.options.loop === true) {
			return;
		}
		this.onMove((index) => {
			if (index === 0) {
				prevButton.classList.add('carousel__prev--hidden');
			} else {
				prevButton.classList.remove('carousel__prev--hidden');
			}

			if (this.items[this.currentItem + this.slidesVisible] === undefined) {
				nextButton.classList.add('carousel__next--hidden');
			} else {
				nextButton.classList.remove('carousel__next--hidden');
			}
		});
	}

	next() {
		this.gotoItem(this.currentItem + this.slidesToScroll);
	}

	prev() {
		this.gotoItem(this.currentItem - this.slidesToScroll);
	}

	/**
     * create Pagination
     */
	createPagination() {
		let pagination = this.createDivWithClass('carousel__pagination');
		let buttons = [];

		this.root.appendChild(pagination);

		for (let i = 0; i < this.items.length - 2 * this.offset; i = i + this.options.slidesToScroll) {
			let button = this.createDivWithClass('carousel__pagination__button');
			button.addEventListener('click', () => this.gotoItem(i + this.offset));
			pagination.appendChild(button);
			buttons.push(button);
		}

		this.onMove((index) => {
			let count = this.items.length - 2 * this.offset;
			let activeButton = buttons[Math.floor(((index - this.offset) % count) / this.options.slidesToScroll)];
			if (activeButton) {
				buttons.forEach((button) => button.classList.remove('carousel__pagination__button--active'));
				activeButton.classList.add('carousel__pagination__button--active');
			}
		});
	}

	/**
     * Moves the carousel to the targeted item
     * @param {number} index
     * @param {boolean} animation
     */
	gotoItem(index = 0, animation = true) {
		// Adjuct the index, if next or prev slides are not enough
		let cpt = 0;
		if (index + this.slidesVisible > this.items.length && index > this.currentItem) {
			for (let i = 1; i <= this.slidesVisible; i++) {
				if (this.items[this.currentItem + this.slidesToScroll - 1 + i] === undefined) cpt++;
			}

			if (cpt < this.slidesToScroll) index = index - cpt;
		} else if (index < 0 && index < this.currentItem) {
			for (let i = this.slidesToScroll; i > 0; i--) {
				if (this.items[this.currentItem - i] === undefined) cpt++;
			}

			if (cpt < this.slidesToScroll) index = index + cpt;
		}

		if (index < 0) {
			if (this.options.loop) index = this.items.length - this.slidesVisible;
			else index = this.currentItem;
		} else if (
			index >= this.items.length ||
			(this.items[this.currentItem + this.slidesVisible] === undefined && index > this.currentItem)
		) {
			if (this.options.loop) index = 0;
			else index = this.currentItem;
		}

		let translateX = index * -100 / this.items.length;

		if (animation === false) this.disableTransition();
		this.translate(translateX);
		this.container.offsetHeight; // force repaint
		if (animation === false) this.enableTransition();

		this.currentItem = index;

		this.moveCallBacks.forEach((cb) => cb(index));

		this.fromAction = true;
	}

	/**
     * @param {number} percent 
     */
	translate(percent) {
		this.container.style.transform = 'translate3d(' + percent + '%, 0, 0)';
	}

	disableTransition() {
		this.container.style.transition = 'none';
	}

	enableTransition() {
		this.container.style.transition = '';
	}

	/**
     * Move the container to give the impression of an infinite slide
     */
	/**
     * 1 2 3 4 5 6 7
     * 3 4 5 6 7 | 1 2 3 4 5 6 7 | 1 2 3 4 5
     */
	resetInfinite() {
		if (!this.fromAction) return;

		if (this.currentItem <= this.options.slidesToScroll) {
			this.gotoItem(this.currentItem + (this.items.length - 2 * this.offset), false);
		} else if (this.currentItem >= this.items.length - this.offset) {
			this.gotoItem(this.currentItem - (this.items.length - 2 * this.offset), false);
		}

		this.fromAction = false;
	}

	/**
     * 
     * @param {callback} callBack 
     */
	onMove(callBack) {
		this.moveCallBacks.push(callBack);
	}

	/**
     * @returns {number}
     */
	get slidesToScroll() {
		return this.isMobile ? 1 : this.options.slidesToScroll;
	}

	/**
     * @returns {number}
     */
	get slidesVisible() {
		return this.isMobile ? 1 : this.options.slidesVisible;
	}

	/**
     * @returns {number}
     */
	get containerWidth() {
		return this.container.offsetWidth;
	}

	/**
     * @returns {number}
     */
	get carouselWidth() {
		return this.root.offsetWidth;
	}

	/**
     * Adapt carousel to winsow screen
     */
	onWindowResize() {
		let mobile = window.innerWidth < 800;
		if (mobile !== this.isMobile) {
			this.isMobile = mobile;
			this.setStyle();
			this.moveCallBacks.forEach((cb) => cb(this.currentItem));
		}
	}
}
