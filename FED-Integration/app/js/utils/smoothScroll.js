import $script from 'scriptjs';

let instance;
class Scroll {
    constructor() {
        instance = this;
        instance.isLoaded = false;
    }

    loadLibrary() {
        $script('https://cdn.jsdelivr.net/gh/cferdinandi/smooth-scroll/dist/smooth-scroll.polyfills.min.js', () => {
            instance.isLoaded = true;
            instance.doScroll(instance.element, instance.options);
        });
    }

    doScroll(element, options) {
        instance.element = element;
        instance.options = options;
        if (!instance.isLoaded) {
            instance.loadLibrary();
            return;
        }

        const scroll = new SmoothScroll();
        scroll.animateScroll(instance.element, null, instance.options);
    }
}

export default Scroll;
