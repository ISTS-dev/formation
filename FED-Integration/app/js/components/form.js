import axios from 'axios';
import autosize from 'autosize';
import $script from 'scriptjs';
import { ajaxCallback } from './utils';
import { Modal } from './modal';

// ///////////////////////////////
/* Form CLASS */
// ///////////////////////////////
const parlseyOption = {
    triggerAfterFailure: 'focusout',
    validationThreshold: 1,
    errorsContainer(field) {
        return field;
    }
};

class Form {
    /**
     * @function validateInput
     * @description Validate a single input
     * @memberOf Form
     */
    static validateInput(element) {
        // $script('https://unpkg.com/parsleyjs@2.8.1/dist/parsley.min.js', function() {
        if (element.type == 'hidden') return;
        const inputLabel = element.closest('label') || element.closest('.select-wrapper');

        // add custom regex validation
        if (element.classList.contains('js-janrain-regex')) {
            let patternCount = 0;

            for (let i = 0, atts = element.attributes, n = atts.length; i < n; i++) {
                const attr = atts[i].nodeName;
                if (attr.includes('janrainregex') && !attr.includes('message')) patternCount += 1;
            }

            if (patternCount) {
                for (let j = 0; j < patternCount; j++) {
                    if (window.Parsley.hasValidator(`janrainregex${j + 1}`)) break;
                    let message;
                    Parsley.addValidator(`janrainregex${patternCount}`, {
                        validateString(value, requirement, instance) {
                            const currentInput = instance.element;
                            const pattern = new RegExp(requirement);
                            const result = pattern.test(value);
                            if (result)
                                message = currentInput.getAttribute(
                                    `data-parsley-janrainregex${j + 1}-message`
                                );
                            return result;
                        },
                        messages: {
                            en: message
                        }
                    });
                }
            }
        }

        // validate the input
        $(element)
            .parsley(parlseyOption)
            .validate();

        const isValid = $(element)
            .parsley()
            .isValid();

        if (inputLabel) {
            if (element.value) inputLabel.classList.add('active');

            if (element.classList.contains('parsley-success')) {
                inputLabel.classList.remove('error');
                inputLabel.classList.add('success');
            } else if (element.classList.contains('parsley-error')) {
                inputLabel.classList.remove('success');
                inputLabel.classList.add('error');
            }
        }
        return isValid;
    }

    /**
     * @function checkFormValidation
     * @description Validate an all form to display the submit button or not
     * @memberOf Form
     */
    static checkFormValidation(elem) {
        const parent = elem.closest('.js-form');

        if (!parent) return;

        const inputs = parent.querySelectorAll('input, select, textarea');
        const formButton = parent.nextElementSibling.getElementsByClassName('js-dynamic-button')[0];
        let valid = true;

        // Go trough each input of the current form
        for (let i = 0; i < inputs.length; i++) {
            const input = inputs[i];

            // don't proceed IF valid is false
            if (!valid) break;

            // check if input is required
            if (input.hasAttribute('required') && !input.closest('.js-add-child-template')) {
                // check is input is a checkbox
                if (input.closest('.checkbox')) {
                    // not checked, form is invalid
                    if (!input.checked) valid = false;
                } else if (input.closest('.radio')) {
                    if (input.closest('fieldset').classList.contains('input-half')) {
                        if (
                            input.closest('fieldset').querySelectorAll('.parsley-success').length ==
                            0
                        ) {
                            valid = false;
                        }
                    } else if (!input.closest('fieldset').classList.contains('parsley-success')) {
                        valid = false;
                    }
                } else if (!input.classList.contains('parsley-success')) {
                    // not parsley success, form is invalid
                    valid = false;
                }
            }
        }

        if (!formButton) return;

        // If form is valid, display the primary button
        if (valid) {
            // formButton.classList.add('btn--primary');
            formButton.classList.remove('btn--disabled');
            return true;

            // If form is not valid, display the disabled button
        }
        formButton.classList.add('btn--disabled');
        // formButton.classList.remove('btn--primary');
        return false;
    }

    /**
     * @function createFormObject
     * @description Fetch ids and values of form inputs and make into an object
     * @memberOf Form
     */
    static createFormObject(inputs) {
        const object = [];

        // Go trough each input of the current form
        for (let i = 0; i < inputs.length; i++) {
            const elem = inputs[i];
            const { id } = elem;
            let { value } = elem;

            // different behavior if it is a checkbox - checked property
            if (elem.closest('.checkbox')) {
                if (!elem.closest('.checkbox').classList.contains('js-plural-checkbox')) {
                    value = elem.checked;
                }
            }

            if (elem.closest('.radio')) {
                value = elem.checked;
            }

            const objectTmp = {};
            objectTmp.key = id;
            objectTmp.value = value;

            // push object
            object.push(objectTmp);
        }

        return object;
    }
}

export default Form;

// ///////////////////////////////
/* Form CONTROLLER */
// ///////////////////////////////

document.addEventListener('click', (e) => {
    const elem = e.target;

    /* Click on tabs label */
    if (elem.classList.contains('js-tabs-label')) {
        e.preventDefault();
        console.log("tabs");
        let labels = document.querySelectorAll(".js-tabs-label");
        labels.forEach((label) => {
            label.closest("li").classList.remove("active");
        });
        elem.closest("li").classList.add("active");
        let dataId = elem.getAttribute("data-id");
        let items = document.querySelectorAll(".js-tabs-item");
        items.forEach((item) => {
            item.classList.remove("active");
        });
        document.querySelector(".js-tabs-item[data-id='"+dataId+"']").classList.add("active");
        return;
    }
});

/* Click events */
document.addEventListener('click', (e) => {
    const elem = e.target;

    /* Click on Sign Up button */
    if (elem.classList.contains('btn--disabled')) {
        e.preventDefault();
        return;
    }

    /* Click on Toggle Password Icon */
    if (elem.classList.contains('js-toggle-password')) {
        const input = elem.closest('label').getElementsByTagName('input')[0];

        if (elem.classList.contains('icon-eye')) {
            elem.classList.remove('icon-eye');
            elem.classList.add('icon-eye_close');
            input.setAttribute('type', 'text');
        } else if (elem.classList.contains('icon-eye_close')) {
            elem.classList.remove('icon-eye_close');
            elem.classList.add('icon-eye');
            input.setAttribute('type', 'password');
        }
    }

    /* Click on submit button */
    if (elem.classList.contains('js-open-modal')) {
        e.preventDefault();
        const modal = new Modal();
        modal.open('<h1>MODAL</h1>', 'big');
    }

    /* Click on Radio Icon */
    if (elem.type == 'radio') {
        const radio = elem.closest('fieldset').getElementsByClassName('radio');

        for (let i = 0; i < radio.length; i++) {
            radio[i].classList.remove('selected');
        }

        if (elem.checked) elem.closest('.radio').classList.add('selected');
    }

    /* Click on checkbox radio style */
    if (elem.type == 'checkbox') {
        if (elem.closest('.checkbox')) {
            if (elem.checked) {
                elem.closest('.checkbox').classList.add('selected');
            } else {
                elem.closest('.checkbox').classList.remove('selected');
            }
        }
    }
});

// Inputs events
const inputs =
    'input[type="radio"], input[type="checkbox"], input[type="password"], input[type="text"], input[type="email"], textarea, select';

// Toggle active class when user is focusin/focusout on inputs
const activeEvents = ['focusin', 'focusout', 'onchange'];

// Validate Input and Form on every changes
const validationEvents = ['focusout', 'change', 'keydown'];

// handle the active state event for inputs
const handleInputActiveState = (e, eventType) => {
    const element = e.target;
    // prevent event in DOB inputs
    if (element.matches(inputs) && !element.matches('.js-date-picker-janrain')) {
        const label = element.closest('label');
        if (!label) return;
        // on focusout, if value is empty remove the active state
        if (eventType === 'focusout') {
            if (element.value == '') label.classList.remove('active');
            // on focusin, put active state if not already
        } else if (!label.classList.contains('active')) label.classList.add('active');
    }
};

// handle the active state event for inputs
let timeout;
const handleInputValidation = (e, eventType) => {
    const element = e.target;
    // prevent event in DOB inputs
    if (element.matches(inputs)) {
        $script('https://code.jquery.com/jquery-3.4.1.min.js', () => {
            $script('https://unpkg.com/parsleyjs@2.8.1/dist/parsley.min.js', () => {
                // if keydown event, add a 2s timeout
                // clear the timeout as soon as a user keydown again
                if (eventType === 'keydown') {
                    clearTimeout(timeout);
                    timeout = setTimeout(() => {
                        // validate input
                        Form.validateInput(element);
                        // validate all form
                        Form.checkFormValidation(element);
                    }, 2000);
                } else {
                    // validate input
                    Form.validateInput(element);
                    // validate all form
                    Form.checkFormValidation(element);
                }
            });
        });
    }
};

for (let i = 0; i < activeEvents.length; i++) {
    document.addEventListener(
        activeEvents[i],
        (e) => {
            handleInputActiveState(e, activeEvents[i]);
        },
        true
    );
}

for (let i = 0; i < validationEvents.length; i++) {
    document.addEventListener(
        validationEvents[i],
        (e) => {
            handleInputValidation(e, validationEvents[i]);
        },
        true
    );
}

// cater for autofill events
try {
    setTimeout(() => {
        const autoFillInputs = document.querySelectorAll('input:-webkit-autofill');
        if (autoFillInputs) {
            autoFillInputs.forEach((autoFillInput) => {
                const label = autoFillInput.closest('label');
                if (label) {
                    label.classList.add('active');
                }
            });
        }
    }, 500);
} catch (error) {
    // console.log(error);
}

const onAutoFillStart = (el) => {
    const label = el.closest('label');
    if (label) {
        label.classList.add('active');
    }
};
const onAutoFillCancel = (el) => {
    const label = el.closest('label');
    if (label) {
        label.classList.remove('active');
    }
};
const onAnimationStart = ({ target, animationName }) => {
    if (animationName === 'onAutoFillStart') {
        return onAutoFillStart(target);
    }
    if (animationName === 'onAutoFillCancel') {
        return onAutoFillCancel(target);
    }
};

const textualInputs = 'input[type="password"], input[type="text"], input[type="email"]';
document.addEventListener('animationstart', (e) => {
    const element = e.target;
    if (element.matches(textualInputs)) {
        onAnimationStart(e);
    }
});

/**
 * checkbox state change in alpha thank you pages
 */
const checkboxAlpha = document.querySelectorAll('.js-checkbox-state .checkbox input');
for (let i = 0; i < checkboxAlpha.length; i++) {
    checkboxAlpha[i].addEventListener('change', () => {
        let valid = true;
        for (let j = 0; j < checkboxAlpha.length; j++) {
            if (!checkboxAlpha[j].checked) {
                valid = false;
                break;
            }
        }
        const button = document.querySelector('.thankyou-alpha__footer a');
        if (valid == true) {
            button.classList.remove('btn--disabled');
            // button.classList.add('btn--primary');
        } else {
            button.classList.add('btn--disabled');
            // button.classList.remove('btn--primary');
        }
    });
}

/** Init Textarea */
autosize(document.querySelectorAll('textarea'));
