import Analytic from '../components/analytic';
import { Modal } from '../components/modal';

const modal = new Modal();

export const ajaxCallback = function(response) {
    // create a template to use the response data
    const templateContent = document.createElement('div');
    templateContent.innerHTML = response.data;

    // get status (OK or KO)
    const status = templateContent.querySelector('.js-webservice-params').getAttribute('data-webservice-status');
    const webserviceRedirectUrl = templateContent.querySelector('.js-webservice-params').getAttribute('data-webservice-redirect-url');

    // Analytics
    const analyticParams = templateContent.querySelectorAll(
        '.js-display-analytics-params, .js-registration-thank-you-analytics-params, .js-successful-login-analytics-params, .js-successful-janrain-analytics-params, .js-submit-mfq-analytics-params'
    );
    if (analyticParams.length) {
        for (let i = 0; i < analyticParams.length; i++) {
            Analytic.layerPush(analyticParams[i]);
        }
    }

    // Get toast datas
    const toast = templateContent.querySelector('.js-toast');
    let toastContent;
    if (toast) {
        toastContent = toast.innerHTML;
    }

    // get ASYNC thank you
    const thankYouMessage = templateContent.querySelector('.js-webservice-thank-you-message.async');
    if (thankYouMessage) {
        const thankYouMessageContent = thankYouMessage.innerHTML;
        localStorage.setItem('AsyncThankYou', thankYouMessageContent);
    }

    // get ASYNC error
    const errorMessage = templateContent.querySelector('.js-error.async');
    if (errorMessage) {
        const errorMessageContent = errorMessage.innerHTML;
        localStorage.setItem('AsyncError', errorMessageContent);
    }

    // redirect the user is webserviceRedirectUrl is set
    const redirectON = webserviceRedirectUrl != undefined && webserviceRedirectUrl != null && webserviceRedirectUrl != '';
    if (redirectON) {
        if (toastContent) {
            localStorage.setItem('toast', toastContent);
        }

        setTimeout(() => {
            window.location = webserviceRedirectUrl;
        }, 500);

        return;
    }
    if (toastContent) {
        setTimeout(() => {
            M.toast({
                html: toastContent,
                displayLength: 2000
            });
            const toastContainer = document.getElementById('toast-container');
            toastContainer.classList.add('active');
            setTimeout(() => {
                toastContainer.classList.remove('active');
            }, 2000);
        }, 2000);
    }

    if (status != 'OK') {
        const error = templateContent.querySelector('.js-webservice-error-message') || templateContent.querySelector('.js-error');
        const errorContainer = document.querySelector('.js-error-container');

        if (!error) return;
        if (errorContainer) {
            errorContainer.innerHTML = null;
            errorContainer.appendChild(error);
        } else {
            setTimeout(() => {
                modal.open(error, 'alert');
            }, 200);
            setTimeout(() => {
                modal.close();
            }, 3000);
        }

        return;
    }

    return templateContent;
};

const asyncPopin = localStorage.getItem('AsyncThankYou') || localStorage.getItem('AsyncError');
if (asyncPopin) {
    modal.open(asyncPopin);
    localStorage.removeItem('AsyncThankYou');
    localStorage.removeItem('AsyncError');
    setTimeout(() => {
        modal.close();
    }, 5000);
}
