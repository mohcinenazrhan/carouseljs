import Carousel from './Carousel';

const onReady = function() {
	new Carousel(document.querySelector('#carousel1'), {
		slidesToScroll: 3,
		slidesVisible: 3,
		loop: false,
		pagination: true
	});

	new Carousel(document.querySelector('#carousel2'), {
		slidesToScroll: 2,
		slidesVisible: 2,
		loop: true
	});

	new Carousel(document.querySelector('#carousel3'), {
		infinite: true
	});

	new Carousel(document.querySelector('#carousel4'), {
		slidesToScroll: 2,
		slidesVisible: 2
	});
};

if (document.readyState !== 'loading') {
	onReady();
}

document.addEventListener('DOMContentLoaded', onReady);
