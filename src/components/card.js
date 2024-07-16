// Функция создания карточки
export function createCard(card, deleteCard, likeCard, OpenImagePopup) {
	const template = document.querySelector('#card-template').content
	const cardElement = template.querySelector('.card').cloneNode(true)
	const cardImage = cardElement.querySelector('.card__image')
	const deleteButton = cardElement.querySelector('.card__delete-button')
	const cardTitle = cardElement.querySelector('.card__title')
	const likeButton = cardElement.querySelector('.card__like-button')

	cardImage.src = card.link
	cardImage.alt = card.name
	cardTitle.textContent = card.name

	// Вешаем обработчик события на кнопку лайка
	likeButton.addEventListener('click', likeCard);

	// Обработчик события на кнопку удаления
	deleteButton.addEventListener('click', deleteCard);

	// Вешаем обработчик клина на картинку
	cardImage.addEventListener('click', function (evt) {
		OpenImagePopup(evt);
	})

	return cardElement
}

export function deleteCard(evt) {
	const cardElement = evt.target.closest('.card')
	if (cardElement) {
		cardElement.remove()
	}
}

export function likeCard(evt) {
	const likeButton = evt.target
	likeButton.classList.toggle('card__like-button_is-active')
}