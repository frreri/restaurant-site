'use strict';

import { getJsonData, createElement } from './helperFunctions.js';

export const setupFoodLogic = async foodJson => {
  const starterBtn = document.querySelector('.btn-starters');
  const mainBtn = document.querySelector('.btn-mains');
  const dessertBtn = document.querySelector('.btn-desserts');
  const drinkBtn = document.querySelector('.btn-drinks');
  const allBtns = [starterBtn, mainBtn, dessertBtn, drinkBtn];
  const foodContainer = document.querySelector('.food-items');

  const order = [];

  try {
    const foods = await getJsonData(foodJson);

    const starters = foods.filter(foodFilter('starter'));
    const mains = foods.filter(foodFilter('main'));
    const desserts = foods.filter(foodFilter('dessert'));
    const drinks = foods.filter(foodFilter('drink'));

    // setting menu event listeners
    menuListener(starterBtn, starters, allBtns, foodContainer);
    menuListener(mainBtn, mains, allBtns, foodContainer);
    menuListener(dessertBtn, desserts, allBtns, foodContainer);
    menuListener(drinkBtn, drinks, allBtns, foodContainer);

    // setting order / cart eventlistener
    addToOrderListener(foodContainer, foods, order);

    // display starters by default
    displayFoods(starters, foodContainer);
    setActiveBtn(starterBtn, allBtns);
  } catch (err) {
    alert(err.message);
    console.log(err);
  }
};

const foodFilter = category => food => food.category === category;

const setActiveBtn = (activeBtn, btnArr) => {
  btnArr.forEach(btn => btn.classList.remove('btn-menu--active'));
  activeBtn.classList.add('btn-menu--active');
};

const displayFoods = (foodArr, foodContainer) => {
  foodContainer.innerHTML = '';

  foodArr.forEach((food, index) => {
    const foodItem = createElement('article', 'food-item');
    foodItem.dataset.id = food.id;

    foodItem.append(createElement('h3', 'food-item-header', food.name));
    foodItem.append(
      createElement('p', 'food-item-description', food.description)
    );

    const foodPrice = createElement('p', 'food-item-price');
    foodPrice.innerHTML = getPriceHtml(food);
    foodItem.append(foodPrice);

    const addBtn = createElement('button', 'btn-order-add');
    addBtn.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="add-icon"><path fill-rule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clip-rule="evenodd" /></svg>';
    foodItem.append(addBtn);

    foodContainer.append(foodItem);
  });
};

const getPriceHtml = foodItem => {
  const currentHour = new Date().getHours();
  let htmlString;
  if (
    currentHour > 10 &&
    currentHour < 15 &&
    foodItem.price !== foodItem.lunchPrice
  ) {
    htmlString = `${foodItem.lunchPrice}kr <span class="food-item-price--regular">${foodItem.price}kr</span>`;
  } else {
    htmlString = `${foodItem.price}kr`;
  }
  return htmlString;
};

const menuListener = (menuBtn, foodArr, allBtns, foodContainer) => {
  menuBtn.addEventListener('click', () => {
    displayFoods(foodArr, foodContainer);
    setActiveBtn(menuBtn, allBtns);
  });
};

const addToOrderListener = (foodContainer, foodArr, orderArr) => {
  foodContainer.addEventListener('click', e => {
    const targetElement = e.target;
    if (targetElement.closest('.btn-order-add')) {
      const element = targetElement.closest('.food-item');
      const foodObject = foodArr.find(item => item.id == element.dataset.id);
      const cartBtn = document.querySelector('#cart-btn');
      addAnimation(element, cartBtn, foodContainer);
      orderArr.push(foodObject);
    }
  });
};

const addAnimation = (sourceElement, targetElement, sourceContainer) => {
  const sourceElementPos = sourceElement.getClientRects()[0];
  const targetElementPos = targetElement.getClientRects()[0];
  const sourceElementCopy = sourceElement.cloneNode(true);
  sourceElementCopy.classList.add('add-to-cart-anim');
  sourceElementCopy.style.top = sourceElementPos.top + 'px';
  sourceElementCopy.style.left = sourceElementPos.left + 'px';
  sourceContainer.append(sourceElementCopy);
  setTimeout(() => {
    sourceElementCopy.style.top = targetElementPos.top + 'px';
    sourceElementCopy.style.left = targetElementPos.left + 'px';
    sourceElementCopy.style.transform = 'translate(-40%, -50%) scale(0)';
    setTimeout(() => {
      sourceElementCopy.remove();
    }, 400);
  }, 1);
};
