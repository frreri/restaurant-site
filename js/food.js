'use strict';

import { getJsonData, createElement } from './helperFunctions.js';

export const setupFoodLogic = async foodJson => {
  const starterBtn = document.querySelector('.btn-starters');
  const mainBtn = document.querySelector('.btn-mains');
  const dessertBtn = document.querySelector('.btn-desserts');
  const drinkBtn = document.querySelector('.btn-drinks');
  const allBtns = [starterBtn, mainBtn, dessertBtn, drinkBtn];

  const order = [];

  try {
    const foods = await getJsonData(foodJson);

    const starters = foods.filter(foodFilter('starter'));
    const mains = foods.filter(foodFilter('main'));
    const desserts = foods.filter(foodFilter('dessert'));
    const drinks = foods.filter(foodFilter('drink'));

    // setting menu event listeners
    setMenuListener(starterBtn, starters, allBtns);
    setMenuListener(mainBtn, mains, allBtns);
    setMenuListener(dessertBtn, desserts, allBtns);
    setMenuListener(drinkBtn, drinks, allBtns);

    // display starters by default
    displayFoods(starters);
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

const displayFoods = foodArr => {
  const foodContainer = document.querySelector('.food-items');
  foodContainer.innerHTML = '';

  foodArr.forEach((food, index) => {
    const foodItem = createElement('div', 'food-item', food.name);
    foodItem.dataset.id = food.id;
    foodItem.dataset.index = index;

    foodContainer.append(foodItem);
  });
};

const setMenuListener = (menuBtn, foodArr, allBtns) => {
  menuBtn.addEventListener('click', () => {
    displayFoods(foodArr);
    setActiveBtn(menuBtn, allBtns);
  });
};
