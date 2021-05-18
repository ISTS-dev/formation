


import Name from './components/name';
import Vortex from './components/vortex';
import Form from './components/form';
import { Slider } from './components/slider';
import './components/dropdown';
import './components/calendar';
import './components/header';

const menu = document.querySelector('.header');
function sticky() {
    const posCurseur = this.pageYOffset;
    if (80 - posCurseur < 1) {
        menu.classList.add('sticky');
    }
    if (posCurseur < 80) {
        menu.classList.remove('sticky');
    }
}

window.addEventListener('scroll', sticky);