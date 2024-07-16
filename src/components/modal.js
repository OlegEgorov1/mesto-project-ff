// Функция открытия модальных окон,
// также добавляем слушатель события по клавиатуре
export function openPopup(element) {
	element.classList.add('popup_is-opened');
	document.addEventListener('keydown', closePopupEsc);
}

// Функция закрытия модальных окон
// также убираем слушатель события по клавиатуре
export function closePopup(element) {
	element.classList.remove('popup_is-opened');
	document.removeEventListener('keydown', closePopupEsc);
}

// Функция закрытия модальных окон через Escape
function closePopupEsc(event) {
	if (event.key === 'Escape') {
		const openPopup = document.querySelector('.popup_is-opened')
			if (openPopup) {
				closePopup(openPopup);
			}
		}
	}

// Функция закрытия модальных окон через Оверлей
export function closePopupOverlay(event) {
	if (event.target.classList.contains('popup')) {
		closePopup(event.target)
	}
}