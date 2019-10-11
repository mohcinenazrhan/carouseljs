/**
 * Add touch navigation for the carousel
 */
export default class CarouselTouchPlugin {
	/**
	 * @param {Carousel} carousel 
	 */
	constructor(carousel) {
		carousel.container.addEventListener('dragstart', (e) => e.preventDefault());
		carousel.container.addEventListener('mousedown', this.startDrag.bind(this));
		carousel.container.addEventListener('touchstart', this.startDrag.bind(this));
		window.addEventListener('mousemove', this.drag.bind(this));
		window.addEventListener('touchmove', this.drag.bind(this));
		window.addEventListener('mouseup', this.endDrag.bind(this));
		window.addEventListener('touchcancel', this.endDrag.bind(this));
		this.carousel = carousel;
	}

	/**
	 * Start moving
	 * @param {MouseEvent|ToucheEvent} e 
	 */
	startDrag(e) {
		if (e.touches) {
			if (e.touches.length > 1) {
				return;
			} else {
				e = e.touches[0];
			}
		}

		this.origin = {
			x: e.screenX,
			y: e.screenY
		};
		this.widthContainer = this.carousel.containerWidth;
		this.carousel.disableTransition();
	}

	/**
	 * Displacement
	 * @param {MouseEvent|ToucheEvent} e 
	 */
	drag(e) {
		if (this.origin) {
			let point = e.touches ? e.touches[0] : e;
			let translate = {
				x: point.screenX - this.origin.x,
				y: point.screenY - this.origin.y
			};
			if (e.touches && Math.abs(translate.x) > Math.abs(translate.y)) {
				e.preventDefault();
				e.stopPropagation();
			}
			let baseTranslate = this.carousel.currentItem * -100 / this.carousel.items.length;
			this.lastTranslate = translate;
			this.carousel.translate(baseTranslate + 100 * translate.x / this.widthContainer);
		}
	}

	/**
	 * End of the moving
	 * @param {MouseEvent|ToucheEvent} e 
	 */
	endDrag() {
		if (this.origin && this.lastTranslate) {
			this.carousel.enableTransition();
			if (Math.abs(this.lastTranslate.x / this.carousel.carouselWidth) > 0.2) {
				if (this.lastTranslate.x < 0) {
					this.carousel.next();
				} else {
					this.carousel.prev();
				}
			} else {
				this.carousel.gotoItem(this.carousel.currentItem);
			}
		}
		this.origin = null;
	}
}
