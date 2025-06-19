export function openModal(popup) {
  popup.classList.add('popup_is-opened', 'popup_is-animated');
  popup.style.visibility = 'visible';
  
  popup.style.opacity = '0';
  requestAnimationFrame(() => {
    popup.style.opacity = '1';
  });

  function handleEsc(event) {
    if (event.key === 'Escape' || event.key === 'Esc') {
      closeModal(popup);
    }
  }
  
  document.addEventListener('keydown', handleEsc);
  
  popup._handleEsc = handleEsc;
}

export function closeModal(popup) {
  popup.classList.remove('popup_is-opened', 'popup_is-animated');

  if (popup._handleEsc) {
    document.removeEventListener('keydown', popup._handleEsc);
    delete popup._handleEsc;
  }
}