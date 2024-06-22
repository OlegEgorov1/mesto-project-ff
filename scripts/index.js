
    const cardContainer = document.querySelector('.places__list');

    function createCard (card, deleteCard) {
        const template = document.querySelector('#card-template').content;
        const cardElement = template.querySelector('.card').cloneNode(true);
        const cardImage = cardElement.querySelector('.card__image');
        const deleteButton = cardElement.querySelector('.card__delete-button');
        const cardTitle = cardElement.querySelector('.card__title');

        cardImage.src = card.link;
        cardImage.alt = card.name;
        cardTitle.textContent = card.name;

        deleteButton.addEventListener('click', function(evt) {
            deleteCard(evt);
        })
        return cardElement;
    }

    function deleteCard (evt) {
        const cardElement = evt.target.closest('.card')
        if (cardElement) {
            cardElement.remove();
        }
    }

    initialCards.forEach(function(elm) {
        const element = createCard(elm, deleteCard);
        cardContainer.append(element);
    })
