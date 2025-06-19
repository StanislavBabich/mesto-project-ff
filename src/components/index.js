import "../pages/index.css";
import { createCard, handleDelete, handleLike } from './card.js';
import { openModal, closeModal } from './modal.js';
import { initialCards } from './cards.js';

const logoImage = require('../images/logo.svg');
const avatarImage = require('../images/avatar.jpg');
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
const inputName = formEdit.querySelector('.popup__input_type_name');
const inputDescription = formEdit.querySelector('.popup__input_type_description');
const popupNewCard = document.querySelector('.popup_type_new-card');
const formNewPlace = document.querySelector('.popup__form[name="new-place"]');
const editButton = document.querySelector('.profile__edit-button');
const addButton = document.querySelector('.profile__add-button');

window.openImagePopup = (src, alt) => {
    openImagePopup(src, alt);
};

initialCards.forEach((card) => {
    const cardElement = createCard(card, handleDelete, handleLike);
    cardsContainer.appendChild(cardElement);
});

function openImagePopup(src, alt) {
    popupImage.src = src;
    popupImage.alt = alt;
    popupCaption.textContent = alt; 
    openModal(imagePopup);
}

editButton.addEventListener('click', () => {
    inputName.value = profileTitle.textContent;
    inputDescription.value = profileDescription.textContent;
    openModal(popupEdit);
});

addButton.addEventListener('click', () => {
    formNewPlace.reset();
    openModal(popupNewCard);
});

document.querySelectorAll('.popup').forEach((popup) => {
    const closeBtn = popup.querySelector('.popup__close');

    closeBtn.addEventListener('click', () => closeModal(popup));

    popup.addEventListener('click', (evt) => {
        if (evt.target === popup) {
            closeModal(popup);
        }
    });
});

formEdit.addEventListener('submit', (evt) => {
    evt.preventDefault();
    profileTitle.textContent = inputName.value;
    profileDescription.textContent = inputDescription.value;
    closeModal(popupEdit);
});

formNewPlace.addEventListener('submit', (evt) => {
    evt.preventDefault();

    const placeName =
        formNewPlace.querySelector('.popup__input_type_card-name').value;
        
    const link =
        formNewPlace.querySelector('.popup__input_type_url').value;

    const newCardData = { name: placeName, link: link };

    const newCardElement = createCard(newCardData, handleDelete, handleLike);

    cardsContainer.prepend(newCardElement);

    formNewPlace.reset();

    closeModal(popupNewCard);
});