// Функция создания карточки
export function createCard(
	cardData,
	userId,
	handleLikeCard,
	handleDeleteCard,
	openImagePopup
) {
	const template = document.querySelector('#card-template').content;
	const cardElement = template.querySelector('.card').cloneNode(true);
	const cardImage = cardElement.querySelector('.card__image');
	const deleteButton = cardElement.querySelector('.card__delete-button');
	const cardTitle = cardElement.querySelector('.card__title');
	const likeButton = cardElement.querySelector('.card__like-button');
	const cardLikeCount = cardElement.querySelector('.card__like-count');

	cardImage.src = cardData.link;
	cardImage.alt = cardData.name;
	cardTitle.textContent = cardData.name;
	cardLikeCount.textContent = cardData.likes.length;

	if (cardData.owner._id === userId) {
		deleteButton.style.display = 'block'
		deleteButton.addEventListener('click', () =>
			handleDeleteCard(cardData._id, cardElement)
		);
	} else {
		deleteButton.style.display = 'none';
	};

	likeButton.addEventListener('click', () =>
		handleLikeCard(cardData._id, likeButton, cardLikeCount)
	);

	cardImage.addEventListener('click', () =>
		openImagePopup(cardData.link, cardData.name)
	);

	return cardElement
}
