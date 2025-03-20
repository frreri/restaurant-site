'use strict';

export const setupLunchModal = () => {
  const lunchBtn = document.querySelector('.btn-lunch');
  const overlay = document.querySelector('.overlay');
  const modal = document.querySelector('.modal');

  const hideOnKeyPress = e => {
    if (e.key === 'Escape') hideModal();
    document.removeEventListener('keydown', hideOnKeyPress);
  };

  const showModal = () => {
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
    document.addEventListener('keydown', hideOnKeyPress);
  };

  const hideModal = () => {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
  };

  lunchBtn.addEventListener('click', showModal);
  overlay.addEventListener('click', hideModal);
};
