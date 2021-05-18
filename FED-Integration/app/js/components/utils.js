export const ajaxCallback = function(response) {
    // create a template to use the response data
    const templateContent = document.createElement('div');
    templateContent.innerHTML = response.data;

    // get status (OK or KO)
    const status = templateContent
        .querySelector('.js-webservice-params')
        .getAttribute('data-webservice-status');
    const webserviceRedirectUrl = templateContent
        .querySelector('.js-webservice-params')
        .getAttribute('data-webservice-redirect-url');

    // redirect the user is webserviceRedirectUrl is set
    const redirectON =
        webserviceRedirectUrl != undefined &&
        webserviceRedirectUrl != null &&
        webserviceRedirectUrl != '';
    if (redirectON) {
        setTimeout(() => {
            window.location = webserviceRedirectUrl;
        }, 500);
        return;
    }

    if (status != 'OK') {
        const error =
            templateContent.querySelector('.js-webservice-error-message') ||
            templateContent.querySelector('.js-error');
        const errorContainer = document.querySelector('.js-error-container');

        if (!error) return;
        if (errorContainer) {
            errorContainer.innerHTML = null;
            errorContainer.appendChild(error);
        }
        return;
    }

    return templateContent;
};
