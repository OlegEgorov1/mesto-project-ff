// Функция показа ошибки ввода
const showInputError = (formElement, inputElement, errorMessage, config) => {
	const errorElement = formElement.querySelector(
		`.${inputElement.id}${config.errorSuffix}`
	)
	inputElement.classList.add(config.inputErrorClass)
	errorElement.textContent = errorMessage
	errorElement.classList.add(config.errorClass)
}

// Функция скрытия ошибки ввода
const hideInputError = (formElement, inputElement, config) => {
	const errorElement = formElement.querySelector(
		`.${inputElement.id}${config.errorSuffix}`
	)
	inputElement.classList.remove(config.inputErrorClass)
	errorElement.classList.remove(config.errorClass)
	errorElement.textContent = ''
}

// Функция проверки валидности поля
const checkInputValidity = (formElement, inputElement, config) => {
    const regex = /^[a-zA-Zа-яА-ЯёЁ\s-]+$/;
    if (inputElement.value === '') {
        showInputError(formElement, inputElement, 'Вы пропустили это поле', config);
    } else if (inputElement.type === 'text' && !regex.test(inputElement.value)) {
        showInputError(formElement, inputElement, 'Разрешены только латинские, кириллические буквы, знаки дефиса и пробелы', config);
    } else if (!inputElement.validity.valid) {
        showInputError(formElement, inputElement, inputElement.validationMessage, config);
    } else {
        hideInputError(formElement, inputElement, config);
    }
};

// Функция валидности полей
const hasInvalidInput = inputList => {
    return inputList.some(inputElement => !inputElement.validity.valid);
};

// Функция блокировки кнопки
const toggleButtonState = (inputList, buttonElement, inactiveButtonClass) => {
	if (hasInvalidInput(inputList)) {
		buttonElement.classList.add(inactiveButtonClass)
		buttonElement.disabled = true
	} else {
		buttonElement.classList.remove(inactiveButtonClass)
		buttonElement.disabled = false
	}
}

// Функция очистки ошибок и деактивации кнопки
const clearValidation = (formElement, config) => {
    const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
    const buttonElement = formElement.querySelector(config.submitButtonSelector);

    inputList.forEach(inputElement => {
        hideInputError(formElement, inputElement, config);
        inputElement.value = ''; // Очистка значений полей
    });
    toggleButtonState(inputList, buttonElement, config.inactiveButtonClass);
};

// Устанавливаем прослушиватель события на input
const setEventListeners = (formElement, config) => {
    const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
    const buttonElement = formElement.querySelector(config.submitButtonSelector);
    toggleButtonState(inputList, buttonElement, config.inactiveButtonClass);
    inputList.forEach(inputElement => {
        inputElement.addEventListener('input', function () {
            checkInputValidity(formElement, inputElement, config);
            toggleButtonState(inputList, buttonElement, config.inactiveButtonClass);
        });
    });
};

// Устанавливаем прослушиватель события на form
const enableValidation = config => {
	const formList = Array.from(document.querySelectorAll(config.formSelector))
	formList.forEach(formElement => {
		formElement.addEventListener('submit', function (event) {
			event.preventDefault()
		})
		setEventListeners(formElement, config);
	});
}

export { enableValidation, clearValidation, toggleButtonState }