import {initialCards} from './cards.js';
import {createCard, deleteCard, likeCard} from './card.js';
import {openPopup, closePopup, closePopupOverlay} from './modal.js';
import '../pages/index.css';


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
    const element = createCard(elm, deleteCard, likeCard)
    cardContainer.append(element);
})

// Функция для отправки формы(Редактирование профиля)
function submitForm (event) {
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
    const newCardElement = createCard(newCard, deleteCard, likeCard)
    cardContainer.prepend(newCardElement);
    formNewPlace.reset();
    closePopup(popupNewCard);
};

// Функция открытия модального окна картинок
function OpenImagePopup(event) {
	if (event.target.tagName === 'IMG') {
		openPopup(popupType)
		popupImage.src = event.target.src;
		popupImage.alt = event.target.alt;
		popupCaption.textContent = event.target.alt;
	}
}

// Вешаем обработчик событий для открытия первого модального окна 
editButton.addEventListener('click', function(){
    openPopup(popupEdit);
    nameInput.value = profileTitle.textContent;
	descriptionInput.value = profileDescription.textContent;
})

// Вешаем обработчик событий для открытия второго модального окна
addButton.addEventListener('click', function(){
    openPopup(popupNewCard);
})

// Вешаем обработчик событий для увеличение картинок третьего модального окна 
cardContainer.addEventListener('click', OpenImagePopup);

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
formProfile.addEventListener('submit', submitForm);
   
// Вешаем обработчик клика для добавления новых карточек
formNewPlace.addEventListener('submit', addNewCard);
