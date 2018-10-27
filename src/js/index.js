import Carousel from './Carousel';

document.addEventListener('DOMContentLoaded', function () {

    new Carousel(document.querySelector('#carousel1'), {
        slidesToScroll: 3,
        slidesVisible: 3,
        loop: false
    })

    new Carousel(document.querySelector('#carousel2'), {
        slidesToScroll: 2,
        slidesVisible: 2,
        loop: true
    })

    new Carousel(document.querySelector('#carousel3'))
    new Carousel(document.querySelector('#carousel4'), {
        slidesToScroll: 2,
        slidesVisible: 2
    })
});