'use strict';

export const setupLunchModal = () => {
  const lunchBtn = document.querySelector('.btn-lunch');
  const overlay = document.querySelector('.overlay');
  const modal = document.querySelector('.modal');

  const showModal = () => {
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
  };

  const hideModal = () => {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
  };

  lunchBtn.addEventListener('click', showModal);
  overlay.addEventListener('click', hideModal);
};
