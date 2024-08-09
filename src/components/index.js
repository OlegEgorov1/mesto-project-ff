import 'core-js/stable';
import { createCard } from './card.js';
import { openPopup, closePopup, closePopupOverlay } from './modal.js';
import '../pages/index.css';
import {
	enableValidation,
	clearValidation,
	toggleButtonState,
} from './validation.js';
import {
	getUserInfo,
	getInitialCards,
	updateUserInfo,
	addCard,
	deleteUserCard,
	updateAvatar,
	likeCard,
	dislikeCard,
} from './api.js';

const cardContainer = document.querySelector('.places__list');
const editButton = document.querySelector('.profile__edit-button');
const avatarContainer = document.querySelector('.profile__image-container');
const popupEdit = document.querySelector('.popup_type_edit');
const popupAvatar = document.querySelector('.popup_type_avatar');
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
const descriptionInput = document.querySelector(
	'.popup__input_type_description'
);
const avatarInput = document.querySelector('.popup__input_type_avatar');
const formProfile = document.forms['edit-profile'];
const formAvatar = document.forms['edit-avatar'];
const formNewPlace = document.forms['new-place'];
const profileAvatar = document.querySelector('.profile__image');

const validationConfig = {
	formSelector: '.popup__form',
	inputSelector: '.popup__input',
	submitButtonSelector: '.popup__button',
	inactiveButtonClass: 'popup__button_disabled',
	inputErrorClass: 'form__input_type_error',
    errorClass: 'form__input-error_active',
	errorSuffix: '-error',
}

enableValidation(validationConfig);

let userData;
// Получение информации о пользователе и начальных карточках с сервера
Promise.all([getUserInfo(), getInitialCards()])
	.then(([userInfo, cardsData]) => {
		userData = userInfo;
		profileTitle.textContent = userData.name;
		profileDescription.textContent = userData.about;
		profileAvatar.style.backgroundImage = `url(${userData.avatar})`;

		cardsData.forEach(card => {
			const element = createCard(
				card,
				userData._id,
				handleLikeCard,
				handleDeleteCard,
				openImagePopup
			)
			cardContainer.append(element);
		});
	})
	.catch(err => {
		console.log(`Ошибка: ${err}`);
	})
// Обработчик событий для формы редактирования профиля
formProfile.addEventListener('submit', event => {
	event.preventDefault();
	const submitButton = event.submitter;
	const originalText = submitButton.textContent;
	submitButton.textContent = 'Сохранение...';
	const name = nameInput.value;
	const about = descriptionInput.value;

	updateUserInfo(name, about)
		.then(data => {
			profileTitle.textContent = data.name;
			profileDescription.textContent = data.about;
			closePopup(popupEdit);
		})
		.catch(err => {
			console.log(`Ошибка: ${err}`);
		})
		.finally(() => {
			submitButton.textContent = originalText;
		});
});
// Обработчик событий для формы обновления аватара
formAvatar.addEventListener('submit', event => {
	event.preventDefault();
	const submitButton = event.submitter;
	const originalText = submitButton.textContent;
	submitButton.textContent = 'Сохранение...';
	const avatar = avatarInput.value;

	updateAvatar(avatar)
		.then(data => {
			profileAvatar.style.backgroundImage = `url(${data.avatar})`;
			closePopup(popupAvatar);
		})
		.catch(err => {
			console.log(`Ошибка: ${err}`);
		})
		.finally(() => {
			submitButton.textContent = originalText;
		});
});
// Обработчик событий для формы добавления новой карточки
formNewPlace.addEventListener('submit', event => {
	event.preventDefault();
	const submitButton = event.submitter;
	const originalText = submitButton.textContent;
	submitButton.textContent = 'Сохранение...';
	const name = formNewPlace.elements['place-name'].value;
	const link = formNewPlace.elements['link'].value;

	if (userData && userData._id) {
		addCard(name, link)
			.then(card => {
				const newCardElement = createCard(
					card,
					userData._id,
					handleLikeCard,
					handleDeleteCard,
					openImagePopup
				)
				cardContainer.prepend(newCardElement);
				formNewPlace.reset();
				closePopup(popupNewCard);
			})
			.catch(err => {
				console.log(`Ошибка: ${err}`);
			})
			.finally(() => {
				submitButton.textContent = originalText;
			});
	} else {
		console.log('Ошибка: userData не определен');
	}
})
// Обработчик удаления карточки
const handleDeleteCard = (cardId, cardElement) => {
	deleteUserCard(cardId)
		.then(() => {
			cardElement.remove();
		})
		.catch(err => {
			console.log(`Ошибка: ${err}`);
		});
};
// Обработчик лайков карточки
const handleLikeCard = (cardId, likeButton, likeCount) => {
	if (likeButton.classList.contains('card__like-button_is-active')) {
		dislikeCard(cardId)
			.then(updatedCard => {
				likeButton.classList.remove('card__like-button_is-active');
				likeCount.textContent = updatedCard.likes.length;
			})
			.catch(err => {
				console.log(`Ошибка: ${err}`);
			});
	} else {
		likeCard(cardId)
			.then(updatedCard => {
				likeButton.classList.add('card__like-button_is-active');
				likeCount.textContent = updatedCard.likes.length;
			})
			.catch(err => {
				console.log(`Ошибка: ${err}`);
			});
	}
};
// Открытие модального окна с изображением
const openImagePopup = (link, name) => {
	openPopup(popupType);
	popupImage.src = link;
	popupImage.alt = name;
	popupCaption.textContent = name;
};
// Обработчик открытия формы редактирования профиля
editButton.addEventListener('click', function () {
	clearValidation(popupEdit.querySelector('.popup__form'), validationConfig);
	openPopup(popupEdit);
	nameInput.value = profileTitle.textContent;
	descriptionInput.value = profileDescription.textContent;

	const inputList = Array.from(
		popupEdit.querySelectorAll(validationConfig.inputSelector)
	);
	const buttonElement = popupEdit.querySelector(
		validationConfig.submitButtonSelector
	)
	toggleButtonState(
		inputList,
		buttonElement,
		validationConfig.inactiveButtonClass
	);
});
// Обработчик открытия формы обновления аватара
avatarContainer.addEventListener('click', function () {
	clearValidation(popupAvatar.querySelector('.popup__form'), validationConfig);
	openPopup(popupAvatar);
	avatarInput.value = '';
})
// Обработчик открытия формы добавления новой карточки
addButton.addEventListener('click', function () {
	clearValidation(popupNewCard.querySelector('.popup__form'), validationConfig);
	openPopup(popupNewCard);
})
// Обработчики закрытия модальных окон
closePopups.forEach(button => {
	button.addEventListener('click', function () {
		const popup = button.closest('.popup');
		closePopup(popup);
	})
})
// Закрытие модальных окон по клику на оверлей
popups.forEach(popup => {
	popup.addEventListener('click', closePopupOverlay);
	popup.classList.add('popup_is-animated');
})