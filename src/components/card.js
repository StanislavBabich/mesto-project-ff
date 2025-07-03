//card.js
import * as api from './api.js';

export function handleLike(cardData, likeButton) {
  const isLiked = likeButton.classList.contains('card__like-button_is-active');

  if (isLiked) {
    api.unlikeCard(cardData._id)
      .then((updatedCard) => {
        likeButton.classList.remove('card__like-button_is-active');
        // Можно обновить счётчик лайков, если он есть
      })
      .catch(err => console.error('Ошибка снятия лайка:', err));
  } else {
    api.likeCard(cardData._id)
      .then((updatedCard) => {
        likeButton.classList.add('card__like-button_is-active');
        // Можно обновить счётчик лайков, если он есть
      })
      .catch(err => console.error('Ошибка постановки лайка:', err));
  }
}

export function handleDelete(cardId, cardNode) {
  if (confirm('Вы уверены, что хотите удалить эту карточку?')) {
    api.deleteCard(cardId)
      .then(() => {
        cardNode.remove();
      })
      .catch(err => {
        console.error('Ошибка удаления карточки:', err);
        alert('Не удалось удалить карточку');
      });
  }
}

export function createCard(cardData, handleDeleteFn, handleLikeFn, handleOpen) {
  const cardTemplate = document.querySelector('#card-template');
  const cardElement = cardTemplate.content.querySelector('.card').cloneNode(true);

  const cardImage = cardElement.querySelector('.card__image');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const cardTitle = cardElement.querySelector('.card__title');
  const likeButton = cardElement.querySelector('.card__like-button');

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  const userId = window.currentUserId || null;

  if (!cardData.owner || cardData.owner._id !== userId) {
    deleteButton.style.display = 'none';
  }

  if (cardData.likes && cardData.likes.some(user => user._id === userId)) {
    likeButton.classList.add('card__like-button_is-active');
  }

  deleteButton.addEventListener('click', () => {
    handleDeleteFn(cardData._id, cardElement);
  });

  likeButton.addEventListener('click', () => {
    handleLikeFn(cardData, likeButton);
  });

  cardImage.addEventListener('click', () => {
    if (typeof handleOpen === 'function') {
      handleOpen(cardData.link, cardData.name);
    }
  });

  return cardElement;
}
