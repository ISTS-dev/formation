import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
// import Analytic from './analytic';
// import { videoInstance } from './video-youtube';

let instance = null;

export class Modal {
    constructor() {
        if (!instance) instance = this;

        instance.modalID = 'modal';
    }

    // create the modal HTML
    createModal() {
        // create the modal
        const modal = document.createElement('div');

        // add ID to the modal HTML
        modal.id = instance.modalID;

        // set the aria-hidden to true
        modal.setAttribute('aria-hidden', true);

        // cater for 1 or multiple sizes
        const sizeClasses = instance.handleSize();

        // apply default HTML structure of the modal
        modal.innerHTML = `
            <div class="modal__overlay js-modal-overlay">
                <div class="modal ${sizeClasses}" role="dialog" aria-modal="true">
                    <div class="modal__close">
                        <a class="modal__cross js-close-modal" href="#" aria-label="Close modal" >
                            <i class="fa fa-times"></i>
                            <div class="sr-only">Close pop-in</div>
                        </a>
                    </div>
                    <div class="modal__content js-modal-placeholder">
                    </div>
                </div>
            </div>`;

        // data can be a string or a node
        if (typeof instance.modalData === 'string') {
            modal.querySelector('.js-modal-placeholder').innerHTML += instance.modalData;
        } else {
            modal.querySelector('.js-modal-placeholder').appendChild(instance.modalData);
        }

        return modal;
    }

    // update a modal HTML
    updateModal() {
        // get the modal currently open
        const modal = instance.modal.querySelector('.modal');

        // cater for 1 or multiple sizes
        const sizeClasses = instance.handleSize();

        // erase the current classes with the new ones
        modal.className = `modal ${sizeClasses}`;

        // empty the modal content
        modal.querySelector('.js-modal-placeholder').innerHTML = '';

        // data can be a string or a node
        if (typeof instance.modalData === 'string') {
            modal.querySelector('.js-modal-placeholder').innerHTML += instance.modalData;
        } else {
            modal.querySelector('.js-modal-placeholder').appendChild(instance.modalData);
        }

        instance.attachCloseEvent();

        // scroll the user to the top
        document.querySelector('.modal__overlay').scrollTo(0, 0);

        return modal;
    }

    // remove completely the modal from the HTML
    removeModal(id) {
        const IdToDelete = id || instance.modalID;
        const modal = document.getElementById(IdToDelete);
        if (modal) {
            modal.remove();
        }
    }

    // attach close events
    // on cross
    // and on overlay
    attachCloseEvent() {
        const closeCTAs = instance.modal.querySelectorAll('.js-close-modal');
        closeCTAs.forEach((cta) => {
            cta.addEventListener('click', function(e) {
                e.preventDefault();
                instance.close();
            });
        });

        const overlay = instance.modal.querySelector('.js-modal-overlay');
        overlay.addEventListener('click', function(e) {
            if (e.target.classList.contains('js-modal-overlay')) {
                instance.close();
            }
        });
    }

    // display the modal
    displayModal() {
        document.getElementById('modal').setAttribute('aria-hidden', false);
        document.querySelector('html').classList.add('is-modal-open');
    }

    // hide the modal
    hideModal() {
        if (document.getElementById('modal'))
            document.getElementById('modal').setAttribute('aria-hidden', true);
        document.querySelector('html').classList.remove('is-modal-open');
    }

    // disabled the scroll on the body
    disabledScroll() {
        const modal = document.querySelector('.modal');
        disableBodyScroll(modal);
        // document.body.classList.add('scroll-blocked');
    }

    // allow the scroll on the body
    allowScroll() {
        const modal = document.querySelector('.modal');
        enableBodyScroll(modal);
        // document.body.classList.remove('scroll-blocked');
    }

    // cater for multiple sizes
    // should return a string
    handleSize() {
        let sizeClassnames = instance.modalSize;
        if (Array.isArray(sizeClassnames)) {
            sizeClassnames = sizeClassnames.join(' ');
        }
        return sizeClassnames;
    }

    // custom Video event for the Video
    videoCloseEvent() {
        // if (videoInstance.player) {
        //     clearInterval(videoInstance.t);
        // const youtubeVideoPercentage = `${Math.round((100 * videoInstance.player.getCurrentTime()) / videoInstance.player.getDuration())}%`;
        // const youtubeVideoCTA = videoInstance.playCTA;
        // const youtubeOldLabel = youtubeVideoCTA.getAttribute('data-analytics-event-label');
        // if (youtubeVideoPercentage != '100%') {
        //     youtubeVideoCTA.setAttribute('data-analytics-segment-event', '');
        //     youtubeVideoCTA.setAttribute('data-analytics-segment-event-variable2', '');
        //     youtubeVideoCTA.setAttribute('data-analytics-event-label', youtubeOldLabel.replace('0%', youtubeVideoPercentage));
        //     Analytic.layerPush(youtubeVideoCTA);
        // }
        // }
        // video behavior analytic
        // const videoContainer = document.querySelector('.video__container');
        // if (videoContainer) {
        //     const video = videoContainer.querySelector('video');
        //     const percentage = `${Math.round((100 * video.currentTime) / video.duration)}%`;
        //     const videoCTA = document.querySelector('.video__container .js-open-video');
        //     const oldLabel = videoCTA.getAttribute('data-analytics-event-label');
        //     if (percentage != '100%') {
        //         videoCTA.setAttribute('data-analytics-segment-event', '');
        //         videoCTA.setAttribute('data-analytics-segment-event-variable1', '');
        //         videoCTA.setAttribute('data-analytics-segment-event-variable2', '');
        //         videoCTA.setAttribute('data-analytics-event-label', oldLabel.replace('0%', percentage));
        //         Analytic.layerPush(videoCTA);
        //     }
        //     videoContainer.parentNode.removeChild(videoContainer);
        // }
    }

    // open the modal
    open(data, size, delay) {
        // no data, no modal
        if (!data) return;

        instance.modalData = data || null;
        instance.modalSize = size || 'default';
        instance.modalDelay = delay || 0;

        // if a modal already displayed
        // we should update it
        if (instance.modal) {
            instance.updateModal();
            return;
        }

        // create the mockup of the modal to display
        instance.modal = instance.createModal();

        // attach Close Event
        instance.attachCloseEvent();

        // remove any modal
        instance.removeModal();

        // append the new modal (but still hidden)
        document.body.appendChild(instance.modal);

        setTimeout(() => {
            // block the scroll
            instance.disabledScroll();

            // display the modal
            // need a small timeout to get the animation
            setTimeout(() => {
                instance.displayModal();
            }, 50);
        }, instance.modalDelay);
    }

    close() {
        // cater for close analytic events
        // const analyticNode = document.querySelector('.modal .js-close-modal-analytic');
        // if (analyticNode) {
        //     Analytic.layerPush(analyticNode);
        // }

        // custom video events
        instance.videoCloseEvent();

        // hide the modal
        instance.hideModal();

        // allow scroll
        instance.allowScroll();

        // remove completely the modal from the HTML
        setTimeout(() => {
            instance.removeModal();
            instance.modal = null;
        }, 200);
    }
}
