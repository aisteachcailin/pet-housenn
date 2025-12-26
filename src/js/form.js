function initForms() {
    if (typeof emailjs !== 'undefined') {
        emailjs.init('zqh90a2KsfVk8EtwZ');
    }
    
    ['customForm', 'modalForm'].forEach((formId) => {
        const form = document.getElementById(formId);
        if (form) {
            if (form.dataset.initialized === 'true') {
                if (form._submitHandler) {
                    form.removeEventListener('submit', form._submitHandler);
                    form._submitHandler = null;
                }
                form.dataset.initialized = 'false';
            }
            
            if (!form.dataset.initialized || form.dataset.initialized === 'false') {
                new FormValidator(formId);
                form.dataset.initialized = 'true';
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    if (typeof emailjs === 'undefined') {
        const checkEmailjs = setInterval(() => {
            if (typeof emailjs !== 'undefined') {
                clearInterval(checkEmailjs);
                initForms();
            }
        }, 100);

        setTimeout(() => {
            clearInterval(checkEmailjs);
            initForms();
        }, 5000);
    } else {
        initForms();
    }
});

window.initForms = initForms;

const CONFIG = {
    emailService: {
        serviceID: 'service_ya8bqsn',
        templateID: 'template_8b667mk',
        publicKey: 'zqh90a2KsfVk8EtwZ'
    },
    patterns: {
        name: /^[а-яА-ЯёЁa-zA-Z\s-]{2,50}$/,
        phone: /^\+7\s\d{3}\s\d{3}\s\d{2}\s-\s\d{2}$/,
        email: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    },
    messages: {
        requiredName: 'Пожалуйста, укажите имя',
        requiredPhone: 'Пожалуйста, укажите телефон',
        requiredEmail: 'Пожалуйста, укажите email',
        invalidName: 'Имя должно содержать 2-50 букв',
        invalidPhone: 'Введите телефон в формате: +7 900 900 90 - 90',
        invalidEmail: 'Введите корректный email адрес',
        agreementRequired: 'Необходимо согласие'
    }
};

class PhoneMask {
    constructor(input) {
        this.input = input;
        if (!this.input) {
            return;
        }
        this.init();
    }

    init() {
        this.input.addEventListener('input', (event) => this.formatPhone(event));
        this.input.addEventListener('keydown', (event) => this.handleKeyDown(event));
        this.input.addEventListener('blur', () => this.validateCompletePhone());
    }

    formatPhone(event) {
        const cursorPosition = event.target.selectionStart;
        let value = event.target.value.replace(/\D/g, '');
        const isBackspace = event.inputType === 'deleteContentBackward';

        if (value.length > 11) {
            value = value.substring(0, 11);
        }

        let formattedValue = '';

        if (value.length > 0) {
            formattedValue = '+7 ';

            if (value.length > 1) {
                formattedValue += value.substring(1, 4);
            }

            if (value.length >= 4) {
                formattedValue += ` ${value.substring(4, 7)}`;
            }

            if (value.length >= 7) {
                formattedValue += ` ${value.substring(7, 9)}`;
            }

            if (value.length >= 9) {
                formattedValue += ` - ${value.substring(9, 11)}`;
            }
        }

        const previousValue = event.target.value;
        event.target.value = formattedValue;

        let newPosition = cursorPosition;

        if (isBackspace && previousValue.length > formattedValue.length) {
            newPosition = Math.max(0, cursorPosition - (previousValue.length - formattedValue.length));
        } else if (!isBackspace) {
            const addedChars = formattedValue.length - previousValue.length;
            if (addedChars > 0) {
                newPosition = cursorPosition + addedChars;
            }
        }

        newPosition = Math.min(newPosition, formattedValue.length);
        event.target.setSelectionRange(newPosition, newPosition);
    }

    handleKeyDown(event) {
        const controlKeys = [8, 9, 27, 13, 46, 37, 38, 39, 40];
        const comboKeys = [65, 67, 86, 88];

        if (controlKeys.includes(event.keyCode) || (event.ctrlKey && comboKeys.includes(event.keyCode))) {
            return;
        }

        const isNumberKey =
            (event.keyCode >= 48 && event.keyCode <= 57) ||
            (event.keyCode >= 96 && event.keyCode <= 105);

        if (!isNumberKey) {
            event.preventDefault();
        }
    }

    validateCompletePhone() {
        if (!this.input.value) {
            return;
        }

        const cleanValue = this.input.value.replace(/\D/g, '');

        if (cleanValue.length !== 11) {
            this.input.classList.add('form__input--error');
        }
    }
}

class FormValidator {
    constructor(formId) {
        this.form = document.getElementById(formId);
        if (!this.form) {
            return;
        }

        const isModal = formId === 'modalForm';
        const prefix = isModal ? 'modal' : '';
        const errorPrefix = isModal ? 'modal' : '';

        this.inputs = {
            name: document.getElementById(isModal ? 'modalFormName' : 'formName'),
            phone: document.getElementById(isModal ? 'modalFormPhone' : 'formPhone'),
            email: document.getElementById(isModal ? 'modalFormEmail' : 'formEmail'),
            agree: document.getElementById(isModal ? 'modalFormAgree' : 'formAgree'),
            privacy: isModal ? document.getElementById('modalFormPrivacy') : null
        };

        this.errors = {
            name: document.getElementById(isModal ? 'modalNameError' : 'nameError'),
            phone: document.getElementById(isModal ? 'modalPhoneError' : 'phoneError'),
            email: document.getElementById(isModal ? 'modalEmailError' : 'emailError'),
            agree: document.getElementById(isModal ? 'modalAgreeError' : 'agreeError'),
            privacy: isModal ? document.getElementById('modalPrivacyError') : null
        };

        this.isModal = isModal;
        this.phoneMask = this.inputs.phone ? new PhoneMask(this.inputs.phone) : null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupRealTimeValidation();
    }

    setupEventListeners() {
        if (!this.form) {
            console.warn('Form not found for validator');
            return;
        }
        
        const oldHandler = this.form._submitHandler;
        if (oldHandler) {
            this.form.removeEventListener('submit', oldHandler);
        }
        
        this.form._submitHandler = (event) => {
            this.handleSubmit(event);
        };
        this.form.addEventListener('submit', this.form._submitHandler, true); 
        
        const submitButton = this.form.querySelector('button[type="submit"], input[type="submit"]');
        if (submitButton) {
            submitButton.addEventListener('click', (e) => {
            });
        }

        Object.values(this.inputs).forEach((input) => {
            if (!input || input.type === 'checkbox') {
                return;
            }

            input.addEventListener('input', () => {
                this.clearError(input);
                this.updateInputState(input);
            });
        });

        if (this.inputs.agree) {
            this.inputs.agree.addEventListener('change', () => {
                this.clearError(this.inputs.agree);
            });
        }

        if (this.inputs.privacy) {
            this.inputs.privacy.addEventListener('change', () => {
                this.clearError(this.inputs.privacy);
            });
        }
    }

    setupRealTimeValidation() {
        Object.values(this.inputs).forEach((input) => {
            if (!input || input.type === 'checkbox') {
                return;
            }

            input.addEventListener('blur', () => {
                this.validateField(input);
            });
        });
    }

    validateField(input) {
        if (!input) {
            return true;
        }

        const value = input.value.trim();
        let isValid = true;
        let message = '';

        switch (input.name) {
            case 'name':
                if (!value) {
                    isValid = false;
                    message = CONFIG.messages.requiredName;
                } else if (!CONFIG.patterns.name.test(value)) {
                    isValid = false;
                    message = CONFIG.messages.invalidName;
                }
                break;
            case 'phone':
                if (!value) {
                    isValid = false;
                    message = CONFIG.messages.requiredPhone;
                } else if (!CONFIG.patterns.phone.test(value)) {
                    isValid = false;
                    message = CONFIG.messages.invalidPhone;
                }
                break;
            case 'email':
                if (!value) {
                    isValid = false;
                    message = CONFIG.messages.requiredEmail;
                } else if (!this.validateEmail(value)) {
                    isValid = false;
                    message = CONFIG.messages.invalidEmail;
                }
                break;
            default:
                break;
        }

        if (!isValid) {
            this.showError(input, message);
            input.setCustomValidity(' ');
        } else {
            this.clearError(input);
            this.markAsSuccess(input);
            input.setCustomValidity('');
        }

        return isValid;
    }

    validateEmail(email) {
        if (!CONFIG.patterns.email.test(email)) {
            return false;
        }

        const [localPart, domainPart] = email.split('@');
        if (!localPart || !domainPart) {
            return false;
        }

        if (localPart.length > 64 || domainPart.length > 253) {
            return false;
        }

        return /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(domainPart);
    }

    validateForm() {
        let isValid = true;

        Object.values(this.inputs).forEach((input) => {
            if (input && input.type !== 'checkbox' && !this.validateField(input)) {
                isValid = false;
            }
        });

        if (this.inputs.agree && !this.inputs.agree.checked) {
            this.showError(this.inputs.agree, CONFIG.messages.agreementRequired);
            isValid = false;
        } else if (this.inputs.agree) {
            this.clearError(this.inputs.agree);
        }

        if (this.isModal && this.inputs.privacy && !this.inputs.privacy.checked) {
            this.showError(this.inputs.privacy, CONFIG.messages.agreementRequired);
            isValid = false;
        } else if (this.inputs.privacy) {
            this.clearError(this.inputs.privacy);
        }

        return isValid;
    }

    showError(input, message) {
        if (!input) {
            return;
        }

        const errorElement = this.errors[input.name] || this.errors[input.name === 'privacy' ? 'privacy' : input.name];
        if (input.type !== 'checkbox') {
            input.classList.add('form__input--error');
            input.classList.remove('form__input--success', 'form__input--filled');
        }

        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    clearError(input) {
        if (!input) {
            return;
        }

        const errorElement = this.errors[input.name];
        input.classList.remove('form__input--error');

        if (errorElement) {
            errorElement.textContent = '';
        }
    }

    markAsSuccess(input) {
        if (!input) {
            return;
        }

        input.classList.add('form__input--success', 'form__input--filled');
    }

    updateInputState(input) {
        if (!input) {
            return;
        }

        if (input.value.trim()) {
            input.classList.add('form__input--filled');
        } else {
            input.classList.remove('form__input--filled', 'form__input--success');
        }
    }

    async handleSubmit(event) {
        event.preventDefault();
        event.stopPropagation();

        Object.values(this.inputs).forEach((input) => {
            if (input && input.type !== 'checkbox') {
                input.dispatchEvent(new Event('blur', { bubbles: true}));
            }
        });

        let isValid = true;

        if (this.inputs.agree && !this.inputs.agree.checked) {
            this.showError(this.inputs.agree, CONFIG.messages.agreementRequired);
            isValid = false;
        } else if (this.inputs.agree) {
            this.clearError(this.inputs.agree);
        }

        if (this.isModal && this.inputs.privacy && !this.inputs.privacy.checked) {
            this.showError(this.inputs.privacy, CONFIG.messages.agreementRequired);
            isValid = false;
        } else if (this.inputs.privacy) {
            this.clearError(this.inputs.privacy);
        }

        if (!isValid) {
            return false;
        }

        const formData = {
            name: this.inputs.name ? this.inputs.name.value.trim() : '',
            phone: this.inputs.phone ? this.inputs.phone.value.trim() : '',
            email: this.inputs.email ? this.inputs.email.value.trim() : '',
            agree: this.inputs.agree ? this.inputs.agree.checked : false
        };

        try {
            await this.sendFormData(formData);
            this.showSuccessPopup();
            this.form.reset();
            this.clearAllErrors();
        } catch (error) {
            this.showErrorPopup('Произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз.');
        }
    }

    async sendFormData(formData) {
        if (typeof emailjs !== 'undefined') {
            const templateParams = {
                name: formData.name,
                phone: formData.phone,
                email: formData.email,
                date: new Date().toLocaleString('ru-RU')
            };

            return emailjs.send(
                CONFIG.emailService.serviceID,
                CONFIG.emailService.templateID,
                templateParams,
                CONFIG.emailService.publicKey
            );
        }

        const subject = encodeURIComponent('Заявка с сайта ПЭТ-Хаус НН');
        const body = encodeURIComponent(
            `Новая заявка:\n\nИмя: ${formData.name}\nТелефон: ${formData.phone}\nEmail: ${formData.email}`
        );
        window.location.href = `mailto:your-email@domain.com?subject=${subject}&body=${body}`;

        return Promise.resolve();
    }

    showSuccessPopup() {
        if (this.isModal) {
            const contactModal = document.getElementById('contactModal');
            if (contactModal) {
                contactModal.classList.remove('active');
            }
        }

        const popup = document.getElementById('successPopup');
        if (!popup) {
            return;
        }

        popup.classList.add('active');
        document.body.style.overflow = 'hidden';

        const closeBtn = popup.querySelector('.popup__close');
        const closeBtnX = popup.querySelector('.popup__close-btn');
        
        const closePopup = () => {
            popup.classList.remove('active');
            document.body.style.overflow = '';
        };

        if (closeBtn) {
            closeBtn.onclick = closePopup;
        }
        if (closeBtnX) {
            closeBtnX.onclick = closePopup;
        }

        popup.onclick = (event) => {
            if (event.target === popup) {
                closePopup();
            }
        };
    }

    showErrorPopup(message) {
        if (this.isModal) {
            const contactModal = document.getElementById('contactModal');
            if (contactModal) {
                contactModal.classList.remove('active');
            }
        }

        const popup = document.getElementById('errorPopup');
        if (!popup) {
            return;
        }

        const errorText = popup.querySelector('#errorPopupText');
        if (errorText) {
            errorText.textContent = message || 'Произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз.';
        }

        popup.classList.add('active');
        document.body.style.overflow = 'hidden';

        const closeBtn = popup.querySelector('.popup__close');
        const closeBtnX = popup.querySelector('.popup__close-btn');
        
        const closePopup = () => {
            popup.classList.remove('active');
            document.body.style.overflow = '';
        };

        if (closeBtn) {
            closeBtn.onclick = closePopup;
        }
        if (closeBtnX) {
            closeBtnX.onclick = closePopup;
        }

        popup.onclick = (event) => {
            if (event.target === popup) {
                closePopup();
            }
        };
    }

    clearAllErrors() {
        Object.values(this.inputs).forEach((input) => {
            if (!input) {
                return;
            }
            this.clearError(input);
            input.classList.remove('form__input--filled', 'form__input--success');
        });
    }
}