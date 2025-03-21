'use strict';

export const setupScrollingNav = () => {
  const smoothScroll = e => {
    e.preventDefault();

    if (e.target.classList?.contains('nav-btn')) {
      document
        .querySelector(e.target.getAttribute('href'))
        .scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navBar = document.querySelector('.nav-bar');
  const navActiveLine = document.querySelector('.nav-active-line');
  navBar.addEventListener('click', smoothScroll);

  const header = document.querySelector('.header-hero');
  const sectionMenu = document.querySelector('.section-menu');
  const sectionAbout = document.querySelector('.section-about');
  const sectionCart = document.querySelector('.section-cart');

  const observedSections = [header, sectionMenu, sectionAbout, sectionCart];

  const setNavLinePos = entities => {
    entities.forEach(entity => {
      const targetId = entity.target.id;
      if (entity.isIntersecting) {
        if (entity.intersectionRect.height > window.innerHeight / 2) {
          let translateVal;
          let navColor;
          if (targetId === 'home') {
            translateVal = 0;
            navColor = 'rgba(0, 0, 0, 0)';
          } else if (targetId === 'about') {
            translateVal = 100;
            navColor = '#212529';
          } else if (targetId === 'menu') {
            translateVal = 200;
            navColor = '#343a40';
          } else {
            translateVal = 300;
            navColor = '#495057';
          }
          navActiveLine.style.transform = `translateX(${translateVal}%)`;
          navBar.style.backgroundColor = navColor;
        }
      }
    });
  };

  const observer = new IntersectionObserver(setNavLinePos, {
    root: null,
    threshold: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9],
  });
  observedSections.forEach(section => observer.observe(section));
};
