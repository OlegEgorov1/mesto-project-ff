import 'core-js/stable';
import {initialCards} from './cards.js';
import {createCard, deleteCard, likeCard} from './card.js';
import {openPopup, closePopup, closePopupOverlay} from './modal.js';
import '../pages/index.css';
import {
	enableValidation,
	clearValidation,
	toggleButtonState,
} from './validation.js'

import add_icon from '../images/add-icon.svg'
import avatar from '../images/avatar.jpg'
import card_1 from '../images/card_1.jpg'
import card_2 from '../images/card_2.jpg'
import card_3 from '../images/card_3.jpg'
import close from '../images/close.svg'
import delete_icon from '../images/delete-icon.svg'
import edit_icon from '../images/edit-icon.svg'
import like_active from '../images/like-active.svg'
import like_inactive from '../images/like-inactive.svg'
import logo from '../images/logo.svg'


const images = [
	// меняем исходные пути на переменные
	{ name: 'add_icon', link: add_icon },
	{ name: 'avatar', link: avatar },
	{ name: 'card_1', link: card_1 },
	{ name: 'card_2', link: card_2 },
	{ name: 'card_3', link: card_3 },
	{ name: 'close', link: close },
	{ name: 'delete_icon', link: delete_icon },
	{ name: 'edit_icon', link: edit_icon },
	{ name: 'like_active', link: like_active },
	{ name: 'like_inactive', link: like_inactive },
	{ name: 'logo', link: logo },
]


// Переменные для работы с карточками
const cardContainer = document.querySelector('.places__list');

 // Определяем переменные
const editButton = document.querySelector('.profile__edit-button');
const popupEdit = document.querySelector('.popup_type_edit');
const popups = document.querySelectorAll('.popup');
const closePopups = document.querySelectorAll('.popup__close');
const addButton = document.querySelector('.profile__add-button');
const popupNewCard = document.querySelector('.popup_type_new-card');
const popupType = document.querySelector('.popup_type_image');
const popupImage = document.querySelector('.popup__image');
const popupCaption = document.querySelector('.popup__caption');
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const nameInput = document.querySelector('.popup__input_type_name');
const descriptionInput = document.querySelector('.popup__input_type_description');
const formProfile = document.forms['edit-profile'];
const formNewPlace = document.forms['new-place'];

// Добавление начальных карточек
initialCards.forEach(function(elm){
    const element = createCard(elm, deleteCard, likeCard, openImagePopup)
    cardContainer.append(element);
})

// Функция для отправки формы(Редактирование профиля)
function editPopupProfile (event) {
	event.preventDefault();
	profileTitle.textContent = nameInput.value;
	profileDescription.textContent = descriptionInput.value;
    closePopup(popupEdit);
}

// Функция для добавления новых карточек
function addNewCard (event) {
    event.preventDefault();
    const nameNewPlace = formNewPlace.elements['place-name'].value;
    const linkNewPlace = formNewPlace.elements['link'].value;
    const newCard = {name: nameNewPlace, link: linkNewPlace};
    const newCardElement = createCard(
			newCard,
			deleteCard,
			likeCard,
			openImagePopup
		)
    cardContainer.prepend(newCardElement);
    formNewPlace.reset();
	// clearValidation(formNewPlace, validationConfig);
    closePopup(popupNewCard);
};

// Функция открытия модального окна картинок
function openImagePopup(event) {
		openPopup(popupType)
		popupImage.src = event.target.src;
		popupImage.alt = event.target.alt;
		popupCaption.textContent = event.target.alt;
	
}

// Вешаем обработчик событий для открытия первого модального окна 
editButton.addEventListener('click', function(){
	clearValidation(popupEdit.querySelector('.popup__form'), validationConfig)
	openPopup(popupEdit)
	nameInput.value = profileTitle.textContent
	descriptionInput.value = profileDescription.textContent

	// Проверка валидности полей и обновление состояния кнопки
	const inputList = Array.from(
		popupEdit.querySelectorAll(validationConfig.inputSelector))
	const buttonElement = popupEdit.querySelector(
		validationConfig.submitButtonSelector)
	toggleButtonState(inputList, buttonElement, validationConfig.inactiveButtonClass)
})

// Вешаем обработчик событий для открытия второго модального окна
addButton.addEventListener('click', function(){
	clearValidation(popupNewCard.querySelector('.popup__form'), validationConfig);
    openPopup(popupNewCard);
})

// Вешаем обработчик клика для закрытия модальных окон
closePopups.forEach(function(button){
    button.addEventListener('click', function(){
        const popup = button.closest('.popup');
        closePopup(popup);
    });
});

// Вешаем обработчик клика для закрытия модальных окон через Оверлей
// Также добавляем анимации для плавного открытия и закрытия попапов
popups.forEach(function(popup){
    popup.addEventListener('click', closePopupOverlay);
    popup.classList.add('popup_is-animated')
})

// Вешаем обработчик событий для редактирования профиля 
formProfile.addEventListener('submit', editPopupProfile);
   
// Вешаем обработчик клика для добавления новых карточек
formNewPlace.addEventListener('submit', addNewCard);

// Включение валидации
const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
}; 

enableValidation(validationConfig);




















// Работа с API
// 3. Загрузка информации о пользователе с сервера
// Функция для подстановки данных в профиль
function setUserInfo(user) {
    const profileTitle = document.querySelector('.profile__title');
    const profileDescription = document.querySelector('.profile__description');
    const profileAvatar = document.querySelector('.profile__image')

    profileTitle.textContent = user.name;
    profileDescription.textContent = user.about;
    profileAvatar.src = user.avatar;
}

// Функция для получения данных пользователя
function getUserInfo() {
    fetch('https://nomoreparties.co/v1/wff-cohort-19/users/me', {
        method: 'GET',
        headers: {
            authorization: 'f128a874-2d4a-487f-bf4d-ef63e7d789fb',
        },
    })
    .then(res => {
        if (!res.ok) {
            throw new Error(`Ошибка: ${res.status}`);
        }
        return res.json();
    })
    .then(data => {
        setUserInfo(data);
    })
    .catch(err => {
        console.error('Ошибка. Запрос не выполнен:', err);
    });
}

getUserInfo();

// 4. Загрузка карточек с сервера








function loadingCards () {
	fetch('https://nomoreparties.co/v1/wff-cohort-19/cards', {
		method: 'Get',
		headers: {
			authorization: 'f128a874-2d4a-487f-bf4d-ef63e7d789fb',
		},
	})
		.then(res => {
			if (!res.ok) {
				return Promise.reject(`Ошибка: ${res.status}`)
			}
			return res.json()
		})
		.then(data => {
			createCard(data)
		})
		.catch(err => {
			console.error('Ошибка. Запрос не выполнен:', err)
		})
}	

loadingCards();