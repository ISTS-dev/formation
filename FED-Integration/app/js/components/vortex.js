import axios from 'axios';
import { Modal } from './modal';
// import PickerDate from './pickerdate';
import Form from './form';
// import Loader from './loader';
import { ajaxCallback } from './utils';

const modal = new Modal();

let instance;

class Vortex {
    constructor() {
        if (!instance) {
            instance = this;
            instance.isProcessingDisplay = false;
            instance.isProcessingSubmit = false;
        }
        return instance;
    }

    /**
     * @function initVortex
     * @description initialize vortex on the clicked element
     * @memberOf Vortex
     */
    initVortex(element, callback) {
        const userLogged = instance.isUserLogged();
        const fromPopin = element.closest('#modal');

        // if user is logged, simply execute the callcack
        if (userLogged && callback) {
            callback();
            return;
        }

        instance.page = element.getAttribute('data-vortex-action');
        if (!fromPopin) instance.scenario = element.getAttribute('data-vortex-scenario');

        if (callback != null) {
            instance.callback = callback;
        }

        // is vortex is activated and the user is not logged, launch the authentification modal
        if (!userLogged) {
            instance.generateForm();
        }
    }

    /**
     * @function initKeepMeLogin
     * @description initialize initKeepMeLogin on the clicked element
     * @memberOf Vortex
     */
    initKeepMeLogin(element, callback) {
        let dataContext;
        let dataScenario;
        if (element != null) {
            dataContext = element.getAttribute('data-context');
            dataScenario = element.getAttribute('data-scenario');
        }
        instance.dataContext = dataContext;
        instance.scenario = dataScenario;
        instance.page = 'keep-me-login';
        instance.keepMeLoginCallback = callback;
        instance.generateForm();
    }

    /**
     * @function isFullPage
     * @description Check if user is on the Full Page
     * @memberOf Vortex
     */
    isFullPage() {
        return !!document.querySelector('.fullpage');
    }

    /**
     * @function generateForm
     * @description generate all Vortex forms
     * @memberOf Vortex
     */
    generateForm() {
        if (instance.isProcessingDisplay == true) return;
        instance.isProcessingDisplay = true;

        const params = {
            page: instance.page
        };

        let webserviceURL = '/webservice/vortex/getpopin';

        if (instance.page === 'keep-me-login') {
            webserviceURL = '/webservice/vortex/getkeepmelogin';
        } else {
            params.scenario = instance.scenario;
        }

        axios
            .get(webserviceURL, { params })
            .then((response) => {
                if (!response) return;
                const templateContent = ajaxCallback(response);
                if (!templateContent) return;

                if (instance.page == 'keep-me-login') {
                    // check if the webservice return a form to fill
                    const form = templateContent.querySelector('.js-form');
                    if (!form) {
                        if (instance.keepMeLoginCallback) {
                            instance.keepMeLoginCallback();
                        }
                        return;
                    }
                }

                modal.open(templateContent);

                // if any datepicker, initialize it
                // if (templateContent.querySelector('.js-date-picker-janrain')) {
                //     PickerDate.loadDatePicker($('.js-date-picker-janrain'), $('.js-date-picker-janrain-translate'));
                // }
            })
            .finally(function() {
                instance.isProcessingDisplay = false;
            });
    }

    /**
     * @function authentificationCallback
     * @description callback for authentification
     * @param {object} params
     * @memberOf Vortex
     */
    authentificationCallback(params) {
        if (!params.response) return;
        const templateContent = ajaxCallback(params.response);
        if (!templateContent) {
            // create a template to use the response data
            const templateContentError = document.createElement('div');
            templateContentError.innerHTML = params.response.data;
            return;
        }

        // get thank you message
        const thankYouMessage = templateContent.querySelector('.js-webservice-success-message');

        // If user is successfuly logged in
        if (instance.target == 'login' || instance.target == 'register') {
            // Change the body logged attribute to True
            document.body.setAttribute('data-user', 'True');
            if (!instance.isFullPage()) {
                // Update design with logged design
                instance.vortexUXupdate(templateContent);
            }
            // closeSidenav();
        }

        if (instance.target == 'keep-me-login') {
            modal.close();
            setTimeout(() => {
                instance.keepMeLoginCallback();
            }, 1000);
            return;
        }

        setTimeout(() => {
            if (instance.callback) {
                instance.callback();
            }
        }, 1000);

        setTimeout(() => {
            if (instance.keepMeLoginCallback) {
                instance.keepMeLoginCallback();
            }
        }, 1000);

        if (thankYouMessage) {
            if (instance.isFullPage()) {
                // Remove current Content
                const formContent = document.querySelector('.js-form');
                formContent.innerHTML = '';

                // append thanks you message
                formContent.appendChild(thankYouMessage);
            } else {
                modal.close();
                setTimeout(() => {
                    modal.open(thankYouMessage);
                }, 500);
                setTimeout(() => {
                    modal.close();
                }, 3000);
            }
        } else if (params.type != 'sso') {
            modal.close();
        }
        // }
    }

    /**
     * @function vortexUXupdate
     * @description Update mockup when user is successfully logged
     * @memberOf Vortex
     * @param {node} templateContent
     */
    vortexUXupdate(templateContent) {
        if (!templateContent) return;

        const currentHeaderTop = document.querySelector('.js-header-profile-content');
        const newHeaderTop = templateContent.querySelector('.js-webservice-header-profile-content');

        if (currentHeaderTop && newHeaderTop) {
            currentHeaderTop.parentNode.replaceChild(newHeaderTop, currentHeaderTop);
        }
    }

    /**
     * @function submitForm
     * @description Submit the form via AJAX
     * @memberOf Vortex
     */
    submitForm() {
        if (instance.isProcessingSubmit == true) return;
        instance.isProcessingSubmit = true;

        let webserviceURL;

        if (instance.target == 'register') {
            webserviceURL = '/webservice/vortex/postregistration';
        } else if (instance.target == 'login') {
            webserviceURL = '/webservice/vortex/postlogin';
        } else if (instance.target == 'keep-me-login') {
            webserviceURL = '/webservice/vortex/postkeepmelogin';
        } else if (instance.target == 'reset-password') {
            webserviceURL = '/webservice/vortex/postresetpwd';
        } else if (instance.target == 'change-password') {
            webserviceURL = '/webservice/vortex/postchangepwd';
        } else if (instance.target == 'update-profile') {
            webserviceURL = '/webservice/vortex/postupdateprofile';
        }

        let inputs = document.querySelectorAll('.js-form input');
        if (document.querySelectorAll('#modal .js-form input').length > 0) {
            inputs = document.querySelectorAll('#modal .js-form input');
        }

        if (instance.target == 'keep-me-login') {
            inputs = document.querySelectorAll('.modal .js-form input');
        }

        if (instance.isFullPage()) {
            instance.scenario = document
                .querySelector('.js-vortex-container')
                .getAttribute('data-vortex-scenario');
        }

        if (!instance.scenario) {
            const data = document.querySelector('.js-data-action-class');
            if (data) {
                instance.scenario = data.getAttribute('data-scenario');
            }
        }

        let queryStringParam = window.location.search;
        if (queryStringParam) queryStringParam = queryStringParam.substring(1);

        const params = {
            target: instance.target,
            scenario: instance.scenario,
            isFullPage: instance.isFullPage(),
            data: Form.createFormObject(inputs)
        };

        const headers = {};
        axios
            .post(webserviceURL, params, { headers })
            .then((response) => {
                params.response = response;
                instance.authentificationCallback(params);
            })
            .finally(function() {
                instance.isProcessingSubmit = false;
                // Loader.removeLoader();
            });
    }

    /**
     * @function isUserLogged
     * @description isUserLogged
     * @memberOf Vortex
     */
    isUserLogged() {
        return document.getElementsByTagName('body')[0].getAttribute('data-user') === 'True';
    }

    /**
     * @function logOut
     * @description logOut
     * @memberOf Form
     */
    logOut() {
        console.log('Logout Success');
    }

    attachEvents() {
        document.addEventListener('click', (e) => {
            const elem = e.target;

            /* Click on Open Form buttons */
            if (
                elem.classList.contains('js-open-form') &&
                !elem.classList.contains('btn--disabled')
            ) {
                if (instance.isFullPage()) return;
                e.preventDefault();

                if (!document.getElementById('modal')) {
                    instance.callback = null;
                }

                // const callback = function() {};

                instance.initVortex(elem);
            }

            /* Click on Sign Up button */
            if (
                elem.classList.contains('js-signup-btn') &&
                !elem.classList.contains('btn--disabled')
            ) {
                e.preventDefault();
                instance.target = 'register';
                instance.submitForm();
                // Loader.appendLoader(elem);
            }

            /* Click on Sign In button */
            if (
                elem.classList.contains('js-signin-btn') &&
                !elem.classList.contains('btn--disabled')
            ) {
                e.preventDefault();
                instance.target = 'login';
                instance.submitForm();
                // Loader.appendLoader(elem);
            }

            /* Click on Sign In button in Keep Me Login Form */
            if (
                elem.classList.contains('js-keepmelogin-btn') &&
                !elem.classList.contains('btn--disabled')
            ) {
                e.preventDefault();
                instance.target = 'keep-me-login';
                instance.submitForm();
                // Loader.appendLoader(elem);
            }

            /* Click on Sign In button */
            if (
                elem.classList.contains('js-change-password-btn') &&
                !elem.classList.contains('btn--disabled')
            ) {
                e.preventDefault();
                instance.target = 'change-password';
                instance.submitForm();
                // Loader.appendLoader(elem);
            }

            /* Click on Reset Password button */
            if (
                elem.classList.contains('js-reset-password-btn') &&
                !elem.classList.contains('btn--disabled')
            ) {
                e.preventDefault();
                instance.target = 'reset-password';
                instance.submitForm();
                // Loader.appendLoader(elem);
            }

            /* Click on Update profile button */
            if (
                elem.classList.contains('js-update-profile-btn') &&
                !elem.classList.contains('btn--disabled')
            ) {
                e.preventDefault();
                instance.target = 'update-profile';
                instance.submitForm();
                // Loader.appendLoader(elem);
            }

            /* Click on Sign Out */
            if (elem.classList.contains('js-logout')) {
                e.preventDefault();
                instance.logOut();
            }
        });
    }
}

export default Vortex;

export const vortexInstance = new Vortex();

vortexInstance.attachEvents();
