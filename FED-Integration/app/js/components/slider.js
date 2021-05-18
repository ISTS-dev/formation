let instance = null;
import $script from 'scriptjs';

export class Slider {
    constructor() {
        if (!instance) instance = this;
        instance.textOptions = {
            dots: false,
            arrows: false,
            infinite: false,
            setPosition: true,
            autoplay: true,
            autoplaySpeed: 5000,
        };

        instance.imageOptions = {
            dots: false,
            arrows: true,
            infinite: false,
            setPosition: true,
            slidesToShow: 5,
            slidesToScroll: 1,
            prevArrow:"<i class='fa fa-chevron-left'></i>",
            nextArrow:"<i class='fa fa-chevron-right'></i>",
            adaptiveHeight: false,
            responsive: [
                {
                  breakpoint: 768,
                  settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                  }
                },
                {
                  breakpoint: 600,
                  settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                  }
                }
              ]
        };

        instance.userImageOptions = {
            dots: false,
            arrows: true,
            infinite: false,
            setPosition: true,
            slidesToShow: 8,
            slidesToScroll: 1,
            prevArrow:"<i class='fa fa-chevron-left'></i>",
            nextArrow:"<i class='fa fa-chevron-right'></i>",
            adaptiveHeight: false,
            responsive: [
                {
                  breakpoint: 768,
                  settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                  }
                },
                {
                  breakpoint: 600,
                  settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                  }
                }
              ]
        };

    }
    // init the slider with slick JS
    initTextSlider(className) {
        $(className).slick(instance.textOptions);
    }
    // init the service slider with slick JS
    initImagelider(className) {
        $(className).slick(instance.imageOptions);
    }
    // init the service slider with slick JS
    initUserImagelider(className) {
        $(className).slick(instance.userImageOptions);
    }
    
}

const sliderTextNodes = document.querySelectorAll('.js-slider');
if (sliderTextNodes.length) {
    $script('https://code.jquery.com/jquery-3.3.1.min.js', () => {
        $script('https://cdn.jsdelivr.net/gh/kenwheeler/slick@1.8.1/slick/slick.min.js', () => {
            const slider = new Slider();
            slider.initTextSlider('.js-slider');
        });
    });
}

const sliderImageNodes = document.querySelectorAll('.js-slider-image');
if (sliderImageNodes.length) {
    $script('https://code.jquery.com/jquery-3.3.1.min.js', () => {
        $script('https://cdn.jsdelivr.net/gh/kenwheeler/slick@1.8.1/slick/slick.min.js', () => {
            const slider = new Slider();
            slider.initImagelider('.js-slider-image');
        });
    });
}

const sliderUserImageNodes = document.querySelectorAll('.js-slider-user-image');
if (sliderUserImageNodes.length) {
    $script('https://code.jquery.com/jquery-3.3.1.min.js', () => {
        $script('https://cdn.jsdelivr.net/gh/kenwheeler/slick@1.8.1/slick/slick.min.js', () => {
            const slider = new Slider();
            slider.initUserImagelider('.js-slider-user-image');
        });
    });
}
