const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

function showInputError(formElement, inputElement, errorMessage, config) {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  if (!errorElement) return;

  inputElement.classList.add(config.inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(config.errorClass);
}

function hideInputError(formElement, inputElement, config) {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  if (!errorElement) return;

  inputElement.classList.remove(config.inputErrorClass);
  errorElement.textContent = '';
  errorElement.classList.remove(config.errorClass);
}

function checkInputValidity(formElement, inputElement, config, isFormSubmitted = false) {
  const value = inputElement.value.trim();
  const touched = inputElement.dataset.touched === 'true';
  const shouldShowError = touched || isFormSubmitted;

  if (
    inputElement.hasAttribute('data-error') &&
    (inputElement.id === 'popup__profile-name' ||
      inputElement.id === 'popup__profile-job' ||
      inputElement.id === 'popup__card-name')
  ) {
    const pattern = /^[a-zA-Zа-яА-ЯёЁ\s-]+$/;

    if (value === '') {
      if (shouldShowError) {
        showInputError(formElement, inputElement, 'Вы пропустили это поле', config);
      } else {
        hideInputError(formElement, inputElement, config);
      }
      return false;
    }

    if (!pattern.test(value)) {
      if (shouldShowError) {
        showInputError(formElement, inputElement, inputElement.dataset.error, config);
      } else {
        hideInputError(formElement, inputElement, config);
      }
      return false;
    }

    if (inputElement.hasAttribute('minlength')) {
      const minLength = Number(inputElement.getAttribute('minlength'));
      if (value.length < minLength) {
        if (shouldShowError) {
          showInputError(
            formElement,
            inputElement,
            `Минимальное количество символов: ${minLength}. Длина текста сейчас: ${value.length} символ.`,
            config
          );
        } else {
          hideInputError(formElement, inputElement, config);
        }
        return false;
      }
    }

    if (inputElement.hasAttribute('maxlength')) {
      const maxLength = Number(inputElement.getAttribute('maxlength'));
      if (value.length > maxLength) {
        if (shouldShowError) {
          showInputError(
            formElement,
            inputElement,
            `Максимальное количество символов: ${maxLength}. Длина текста сейчас: ${value.length} символ.`,
            config
          );
        } else {
          hideInputError(formElement, inputElement, config);
        }
        return false;
      }
    }

    hideInputError(formElement, inputElement, config);
    return true;
  }

  if (inputElement.id === 'popup__card-url') {
    if (value === '') {
      if (shouldShowError) {
        showInputError(formElement, inputElement, 'Вы пропустили это поле', config);
      } else {
        hideInputError(formElement, inputElement, config);
      }
      return false;
    }
    if (!inputElement.validity.valid) {
      if (shouldShowError) {
        const customMessage = inputElement.dataset.error || inputElement.validationMessage;
        showInputError(formElement, inputElement, customMessage, config);
      } else {
        hideInputError(formElement, inputElement, config);
      }
      return false;
    }
    hideInputError(formElement, inputElement, config);
    return true;
  }

  if (!inputElement.validity.valid) {
    if (shouldShowError) {
      showInputError(formElement, inputElement, inputElement.validationMessage, config);
    } else {
      hideInputError(formElement, inputElement, config);
    }
    return false;
  }

  hideInputError(formElement, inputElement, config);
  return true;
}

function hasInvalidInput(inputList, config, isFormSubmitted = false) {
  return inputList.some(inputElement => !checkInputValidity(inputElement.closest(config.formSelector), inputElement, config, isFormSubmitted));
}

function toggleButtonState(inputList, buttonElement, config, isFormSubmitted = false) {
  if (hasInvalidInput(inputList, config, isFormSubmitted)) {
    buttonElement.classList.add(config.inactiveButtonClass);
    buttonElement.disabled = true;
  } else {
    buttonElement.classList.remove(config.inactiveButtonClass);
    buttonElement.disabled = false;
  }
}

function setEventListeners(formElement, config) {
  const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
  const buttonElement = formElement.querySelector(config.submitButtonSelector);

  toggleButtonState(inputList, buttonElement, config);

  inputList.forEach((inputElement) => {
    inputElement.dataset.touched = 'false';

    inputElement.addEventListener('input', () => {
      inputElement.dataset.touched = 'true';
      checkInputValidity(formElement, inputElement, config);
      toggleButtonState(inputList, buttonElement, config);
    });

    inputElement.addEventListener('blur', () => {
      inputElement.dataset.touched = 'true';
      checkInputValidity(formElement, inputElement, config);
      toggleButtonState(inputList, buttonElement, config);
    });
  });
}

function enableValidation(config) {
  const formList = Array.from(document.querySelectorAll(config.formSelector));
  formList.forEach(formElement => {
    formElement.addEventListener('submit', (evt) => {
      evt.preventDefault();

      const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
      const buttonElement = formElement.querySelector(config.submitButtonSelector);

      inputList.forEach(input => {
        input.dataset.touched = 'true';
        checkInputValidity(formElement, input, config, true);
      });

      toggleButtonState(inputList, buttonElement, config, true);

      if (!hasInvalidInput(inputList, config, true)) {
        formElement.dispatchEvent(new Event('formValid'));
      }
    });
    setEventListeners(formElement, config);
  });
}

function clearValidation(formElement, config) {
  const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
  const buttonElement = formElement.querySelector(config.submitButtonSelector);

  inputList.forEach(inputElement => {
    inputElement.dataset.touched = 'false';
    hideInputError(formElement, inputElement, config);
  });

  buttonElement.disabled = true;
  buttonElement.classList.add(config.inactiveButtonClass);
}

export {
  enableValidation,
  clearValidation,
  validationConfig,
  toggleButtonState,
  checkInputValidity
};