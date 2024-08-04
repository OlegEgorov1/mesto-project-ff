// Функция показа ошибки ввода
const showInputError = (formElement, inputElement, errorMessage) => {
    const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
    inputElement.classList.add('form__input_type_error');
    errorElement.textContent = errorMessage;
    errorElement.classList.add('form__input-error_active');
};

// Функция скрытия ошибки ввода
const hideInputError = (formElement, inputElement) => {
    const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
    inputElement.classList.remove('form__input_type_error');
    errorElement.classList.remove('form__input-error_active');
    errorElement.textContent = '';
};

// Функция проверки валидности поля
const checkInputValidity = (formElement, inputElement) => {
    const regex = /^[a-zA-Zа-яА-ЯёЁ\s-]+$/;
    if (inputElement.value === '') {
        showInputError(formElement, inputElement, "Вы пропустили это поле");
    } else if (inputElement.type === "text" && !regex.test(inputElement.value)) {
        showInputError(formElement, inputElement, "Разрешены только латинские, кириллические буквы, знаки дефиса и пробелы");
    } else if (!inputElement.validity.valid) {
        showInputError(formElement, inputElement, inputElement.validationMessage);
    } else {
        hideInputError(formElement, inputElement);
    }
}

// Функция валидности полей
const hasInvalidInput = (inputList) => {
    return inputList.some((inputElement) => !inputElement.validity.valid);
};

// Функция блокировки кнопки
const toggleButtonState = (inputList, buttonElement, inactiveButtonClass) => {
    if (hasInvalidInput(inputList)) {
        buttonElement.classList.add(inactiveButtonClass);
        buttonElement.disabled = true;
    } else {
        buttonElement.classList.remove(inactiveButtonClass);
        buttonElement.disabled = false;
    }
};

// Функция очистки ошибок и деактивации кнопки
const clearValidation = (formElement, config) => {
    const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
    const buttonElement = formElement.querySelector(config.submitButtonSelector);

    inputList.forEach((inputElement) => {
        hideInputError(formElement, inputElement);
        inputElement.value = ''; // Очистка значений полей
    });
    toggleButtonState(inputList, buttonElement, config.inactiveButtonClass);
};

// Устанавливаем прослушиватель события на input
const setEventListeners = (formElement, config) => {
    const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
    const buttonElement = formElement.querySelector(config.submitButtonSelector);
    toggleButtonState(inputList, buttonElement, config.inactiveButtonClass);
    inputList.forEach((inputElement) => {
        inputElement.addEventListener('input', function () {
            checkInputValidity(formElement, inputElement);
            toggleButtonState(inputList, buttonElement, config.inactiveButtonClass);
        });
    });
};

// Устанавливаем прослушиватель события на form
const enableValidation = (config) => {
    const formList = Array.from(document.querySelectorAll(config.formSelector));
    formList.forEach((formElement) => {
        formElement.addEventListener('submit', function (event) {
            event.preventDefault();
        });
        setEventListeners(formElement, config);
    });
};

export { enableValidation, clearValidation, toggleButtonState};
