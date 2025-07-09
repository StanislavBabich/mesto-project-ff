const cohortId = 'wff-cohort-42';
const token = '57f7533b-cf35-4402-a07a-8edc3d037c3d';
const baseUrl = `https://mesto.nomoreparties.co/v1/${cohortId}`;

function checkResponse(res) {
  if (res.ok) {
    return res.json();
  }
  return res.json()
    .catch(() => ({}))
    .then((errBody) => Promise.reject({ status: res.status, body: errBody }));
}

export function getUserInfo() {
  return fetch(`${baseUrl}/users/me`, {
    headers: {
      authorization: token
    }
  }).then(checkResponse);
}

export function getInitialCards() {
  return fetch(`${baseUrl}/cards`, {
    headers: {
      authorization: token
    }
  }).then(checkResponse);
}

export function updateUserInfo({ name, about }) {
  return fetch(`${baseUrl}/users/me`, {
    method: 'PATCH',
    headers: {
      authorization: token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, about })
  }).then(checkResponse);
}

export function updateUserAvatar(avatarUrl) {
  return fetch(`${baseUrl}/users/me/avatar`, {
    method: 'PATCH',
    headers: {
      authorization: token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ avatar: avatarUrl })
  }).then(checkResponse);
}

export function addCard({ name, link }) {
  return fetch(`${baseUrl}/cards`, {
    method: 'POST',
    headers: {
      authorization: token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, link })
  }).then(checkResponse);
}

export function deleteCard(cardId) {
  return fetch(`${baseUrl}/cards/${cardId}`, {
    method: 'DELETE',
    headers: {
      authorization: token
    }
  }).then(checkResponse);
}

export function likeCard(cardId) {
  return fetch(`${baseUrl}/cards/likes/${cardId}`, {
    method: 'PUT',
    headers: {
      authorization: token
    }
  }).then(checkResponse);
}

export function unlikeCard(cardId) {
  return fetch(`${baseUrl}/cards/likes/${cardId}`, {
    method: 'DELETE',
    headers: {
      authorization: token
    }
  }).then(checkResponse);
}