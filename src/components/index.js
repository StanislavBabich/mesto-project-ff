import "../pages/index.css";
import { createCard, handleDelete, handleLike } from './card.js';
import { openModal, closeModal } from './modal.js';
import { enableValidation, clearValidation, validationConfig, toggleButtonState } from './validation.js';
import * as api from './api.js';

import logoImage from '../images/logo.svg';
import avatarImage from '../images/avatar.jpg';

const logoElement = document.querySelector('.header__logo');
logoElement.src = logoImage;

const profileImageElement = document.querySelector('.profile__image');
profileImageElement.style.backgroundImage = `url(${avatarImage})`;

const cardsContainer = document.querySelector('.places__list');

const imagePopup = document.querySelector('.popup_type_image');
const popupImage = imagePopup.querySelector('.popup__image');
const popupCaption = imagePopup.querySelector('.popup__caption');

const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

const popupEdit = document.querySelector('.popup_type_edit');
const formEdit = popupEdit.querySelector('.popup__form');
const inputName = formEdit.querySelector('#popup__profile-name');
const inputDescription = formEdit.querySelector('#popup__profile-job');

const popupNewCard = document.querySelector('.popup_type_new-card');
const formNewPlace = popupNewCard.querySelector('.popup__form');
const inputPlaceName = formNewPlace.querySelector('#popup__card-name');
const inputPlaceLink = formNewPlace.querySelector('#popup__card-url');

const editButton = document.querySelector('.profile__edit-button');
const addButton = document.querySelector('.profile__add-button');

function openImagePopup(src, alt) {
  popupImage.src = src;
  popupImage.alt = alt;
  popupCaption.textContent = alt;
  openModal(imagePopup);
}

function handleEditButtonClick() {
  inputName.value = profileTitle.textContent;
  inputDescription.value = profileDescription.textContent;

  clearValidation(formEdit, validationConfig);

  const inputList = Array.from(formEdit.querySelectorAll(validationConfig.inputSelector));
  const buttonElement = formEdit.querySelector(validationConfig.submitButtonSelector);

  toggleButtonState(inputList, buttonElement, validationConfig, false);

  openModal(popupEdit);
}

function handleAddButtonClick() {
  formNewPlace.reset();

  clearValidation(formNewPlace, validationConfig);

  openModal(popupNewCard);
}

function handleFormEditSubmit(evt) {
  evt.preventDefault();

  const pattern = /^[a-zA-Zа-яА-ЯёЁ\s-]+$/;
  const isNameValid = inputName.value.trim() !== '' && pattern.test(inputName.value.trim());
  const isDescValid = inputDescription.value.trim() !== '' && pattern.test(inputDescription.value.trim());

  if (!isNameValid || !isDescValid) {
    alert('Имя и описание должны содержать только буквы, пробелы и тире');
    return;
  }

  api.updateUserInfo({
    name: inputName.value.trim(),
    about: inputDescription.value.trim()
  })
    .then((updatedUser) => {
      profileTitle.textContent = updatedUser.name;
      profileDescription.textContent = updatedUser.about;
      closeModal(popupEdit);
    })
    .catch(err => {
      console.error('Ошибка обновления профиля:', err);
      alert('Не удалось обновить профиль');
    });
}

function isValidUrl(urlString) {
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function handleFormNewPlaceSubmit(evt) {
  evt.preventDefault();

  const name = inputPlaceName.value.trim();
  const link = inputPlaceLink.value.trim();

  if (!name) {
    alert('Введите название карточки');
    return;
  }

  if (!isValidUrl(link)) {
    alert('Введите корректный URL изображения, начинающийся с http:// или https://');
    return;
  }

  const submitButton = formNewPlace.querySelector(validationConfig.submitButtonSelector);
  if (submitButton) submitButton.disabled = true;

  api.addCard({ name, link })
    .then(newCard => {
      const cardElement = createCard(newCard, handleDelete, handleLike, openImagePopup);
      cardsContainer.prepend(cardElement);
      formNewPlace.reset();
      clearValidation(formNewPlace, validationConfig);
      closeModal(popupNewCard);
    })
    .catch(err => {
      console.error('Ошибка добавления карточки:', err);
      let errorMessage = 'Не удалось добавить карточку';
      if (err && err.status) {
        errorMessage += ` (код ошибки ${err.status})`;
        if (err.body && err.body.message) {
          errorMessage += `: ${err.body.message}`;
        }
      }
      alert(errorMessage);
    })
    .finally(() => {
      if (submitButton) submitButton.disabled = false;
    });
}

editButton.addEventListener('click', handleEditButtonClick);
addButton.addEventListener('click', handleAddButtonClick);

formEdit.addEventListener('submit', handleFormEditSubmit);
formNewPlace.addEventListener('submit', handleFormNewPlaceSubmit);

document.querySelectorAll('.popup').forEach((popup) => {
  const closeBtn = popup.querySelector('.popup__close');

  closeBtn.addEventListener('click', () => closeModal(popup));

  popup.addEventListener('click', (evt) => {
    if (evt.target === popup) {
      closeModal(popup);
    }
  });
});

window.currentUserId = null;

Promise.all([api.getUserInfo(), api.getInitialCards()])
  .then(([userData, cards]) => {
    console.log('Данные профиля:', userData);

    window.currentUserId = userData._id;

    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileImageElement.style.backgroundImage = `url(${userData.avatar})`;

    cardsContainer.innerHTML = '';
    cards.forEach(card => {
      const cardElement = createCard(card, handleDelete, handleLike, openImagePopup);
      cardsContainer.appendChild(cardElement);
    });
  })
  .catch(err => {
    console.error('Ошибка загрузки данных с сервера:', err);
    alert('Не удалось загрузить данные с сервера');
  });

enableValidation(validationConfig);