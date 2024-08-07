// Работа с API
const config = {
	baseUrl: 'https://nomoreparties.co/v1/wff-cohort-19',
	headers: {
		authorization: 'f128a874-2d4a-487f-bf4d-ef63e7d789fb',
		'Content-Type': 'application/json',
	},
};

const checkResponse = res => {
	if (res.ok) {
		return res.json();
	}
	return Promise.reject(`Ошибка: ${res.status}`);
};

// Получение данных от пользователя
export const getUserInfo = () => {
	return fetch(`${config.baseUrl}/users/me`, {
		headers: config.headers,
	}).then(checkResponse);
};

// Получение начальных карточек
export const getInitialCards = () => {
	return fetch(`${config.baseUrl}/cards`, {
		headers: config.headers,
	}).then(checkResponse);
};

// Обновление данных пользователя
export const updateUserInfo = (name, about) => {
	return fetch(`${config.baseUrl}/users/me`, {
		method: 'PATCH',
		headers: config.headers,
		body: JSON.stringify({
			name,
			about,
		}),
	}).then(checkResponse);
};

// Добавление новой карточки
export const addCard = (name, link) => {
	return fetch(`${config.baseUrl}/cards`, {
		method: 'POST',
		headers: config.headers,
		body: JSON.stringify({
			name,
			link,
		}),
	}).then(checkResponse);
};

// Удаление карточек
export const deleteUserCard = cardId => {
	return fetch(`${config.baseUrl}/cards/${cardId}`, {
		method: 'DELETE',
		headers: config.headers,
	}).then(checkResponse);
};

// Постановка лайка
export const likeCard = cardId => {
	return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
		method: 'PUT',
		headers: config.headers,
	}).then(checkResponse);
};

// Снятие лайка
export const dislikeCard = cardId => {
	return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
		method: 'DELETE',
		headers: config.headers,
	}).then(checkResponse);
};

// Обновление аватара
export const updateAvatar = avatar => {
	return fetch(`${config.baseUrl}/users/me/avatar`, {
		method: 'PATCH',
		headers: config.headers,
		body: JSON.stringify({
			avatar,
		}),
	}).then(checkResponse);
};
