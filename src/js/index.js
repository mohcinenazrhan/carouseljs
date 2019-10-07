import Carousel from './Carousel';

const onReady = function() {
	new Carousel(document.querySelector('#carousel1'), {
		slidesToScroll: 3,
		slidesVisible: 3,
		loop: false,
		pagination: true,
		responsive: {
			0: {
				slidesToScroll: 1,
				slidesVisible: 1
			},
			600: {
				slidesToScroll: 2,
				slidesVisible: 2
			},
			1000: {
				slidesToScroll: 3,
				slidesVisible: 3
			}
		}
	});

	new Carousel(document.querySelector('#carousel2'), {
		slidesToScroll: 2,
		slidesVisible: 2,
		loop: true,
		autoplay: true,
		autoplayDelay: 2000
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
