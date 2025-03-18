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

    // menu event listeners
    starterBtn.addEventListener('click', () => {
      displayFoods(starters);
      setActiveBtn(starterBtn, allBtns);
    });
    mainBtn.addEventListener('click', () => {
      displayFoods(mains);
      setActiveBtn(mainBtn, allBtns);
    });
    dessertBtn.addEventListener('click', () => {
      displayFoods(desserts);
      setActiveBtn(dessertBtn, allBtns);
    });
    drinkBtn.addEventListener('click', () => {
      displayFoods(drinks);
      setActiveBtn(drinkBtn, allBtns);
    });

    // display starters by default
    displayFoods(starters);
    setActiveBtn(starterBtn, allBtns);
  } catch (err) {
    alert(err.message);
    console.log(err);
  }
};

const setActiveBtn = (activebtn, btnArr) => {
  btnArr.forEach(btn => btn.classList.remove('btn-menu--active'));
  activebtn.classList.add('btn-menu--active');
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

const foodFilter = category => food => food.category === category;
