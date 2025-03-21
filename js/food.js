'use strict';

import { getJsonData, createEl } from './helperFunctions.js';

export const setupFoodLogic = async foodJson => {
  const starterBtn = document.querySelector('.btn-starters');
  const mainBtn = document.querySelector('.btn-mains');
  const dessertBtn = document.querySelector('.btn-desserts');
  const drinkBtn = document.querySelector('.btn-drinks');
  const allBtns = [starterBtn, mainBtn, dessertBtn, drinkBtn];
  const foodContainer = document.querySelector('.food-items');
  const orderContainer = document.querySelector('.order-container');

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
    addToOrderListener(foodContainer, foods, order, orderContainer);
    handleOrderListener(orderContainer, order);

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

  if (foodArr.length < 1) {
    foodContainer.append(createEl('p', null, 'No foods available'));
    return;
  }

  foodArr.forEach(food => {
    const foodItem = createEl('article', 'food-item');
    foodItem.dataset.id = food.id;

    foodItem.append(createEl('h3', 'food-item-header', food.name));
    foodItem.append(createEl('p', 'food-item-description', food.description));
    if (food.allergens) {
      foodItem.append(
        createEl('p', 'food-item-description', `Allergens: ${food.allergens}`)
      );
    }

    const foodPrice = createEl('p', 'food-item-price');
    foodPrice.innerHTML = getPriceHtml(food);
    foodItem.append(foodPrice);

    const addBtn = createEl('button', 'btn-order-add');
    addBtn.title = 'Add to order';
    addBtn.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="add-icon"><path fill-rule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clip-rule="evenodd" /></svg>';
    foodItem.append(addBtn);

    foodContainer.append(foodItem);
  });
};

const displayOrder = (orderArr, orderContainer) => {
  orderContainer.innerHTML = '';

  if (orderArr.length < 1) {
    orderContainer.append(createEl('p', null, 'Your cart is empty'));
    return;
  }
  let totalCost = 0;
  const currHour = currentHour();
  orderArr.forEach((item, index) => {
    const orderItem = createEl('article', 'order-item');
    orderItem.dataset.index = index;
    const orderTextString = createEl('p');
    orderTextString.innerHTML = `${item.name}, ${getPriceHtml(item)}`;
    orderItem.append(orderTextString);

    const removeBtn = createEl('button', 'btn-order-remove');
    removeBtn.title = 'Remove from order';
    removeBtn.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="remove-icon"><path fill-rule="evenodd" d="M4.25 12a.75.75 0 0 1 .75-.75h14a.75.75 0 0 1 0 1.5H5a.75.75 0 0 1-.75-.75Z" clip-rule="evenodd" /></svg>';
    orderItem.append(removeBtn);

    totalCost += currHour > 10 && currHour < 15 ? item.lunchPrice : item.price;
    orderContainer.append(orderItem);
  });

  const confirmContainer = createEl('div', 'order-confirm');
  confirmContainer.append(createEl('p', null, `Total: ${totalCost}kr`));

  confirmContainer.append(createEl('button', 'btn-order-confirm', 'Confirm'));
  orderContainer.append(confirmContainer);
};

const getPriceHtml = foodItem => {
  const currHour = currentHour();
  let htmlString;
  if (
    currHour > 10 &&
    currHour < 15 &&
    foodItem.price !== foodItem.lunchPrice
  ) {
    htmlString = `${foodItem.lunchPrice}kr <span class="food-item-price--regular">${foodItem.price}kr</span>`;
  } else {
    htmlString = `${foodItem.price}kr`;
  }
  return htmlString;
};

const currentHour = () => new Date().getHours();

const menuListener = (menuBtn, foodArr, allBtns, foodContainer) => {
  menuBtn.addEventListener('click', () => {
    displayFoods(foodArr, foodContainer);
    setActiveBtn(menuBtn, allBtns);
  });
};

const addToOrderListener = (
  foodContainer,
  foodArr,
  orderArr,
  orderContainer
) => {
  foodContainer.addEventListener('click', e => {
    const targetEl = e.target;
    if (targetEl.closest('.btn-order-add')) {
      const el = targetEl.closest('.food-item');
      const foodObject = foodArr.find(item => item.id == el.dataset.id);
      const cartBtn = document.querySelector('#cart-btn');
      addToCartAnim(el, cartBtn, foodContainer);
      orderArr.push(foodObject);
      setCartCount(orderArr.length);
      displayOrder(orderArr, orderContainer);
    }
  });
};

const handleOrderListener = (orderContainer, orderArr) => {
  orderContainer.addEventListener('click', e => {
    const targetEl = e.target;
    if (targetEl.closest('.btn-order-remove')) {
      const elIndex = targetEl.closest('.order-item').dataset.index;
      orderArr.splice(elIndex, 1);
      setCartCount(orderArr.length);
      displayOrder(orderArr, orderContainer);
    }

    if (targetEl.closest('.btn-order-confirm')) {
      orderArr.splice(0, orderArr.length);
      setCartCount(orderArr.length);
      displayOrder(orderArr, orderContainer);
      toastOrder();
    }
  });
};

const addToCartAnim = (sourceEl, targetEl, sourceContainer) => {
  const sourceElPos = sourceEl.getClientRects()[0];
  const targetElPos = targetEl.getClientRects()[0];
  const sourceElCopy = sourceEl.cloneNode(true);
  sourceElCopy.classList.add('add-to-cart-anim');
  sourceElCopy.style.top = sourceElPos.top + 'px';
  sourceElCopy.style.left = sourceElPos.left + 'px';
  sourceContainer.append(sourceElCopy);
  setTimeout(() => {
    sourceElCopy.style.top = targetElPos.top + 'px';
    sourceElCopy.style.left = targetElPos.left + 'px';
    sourceElCopy.style.transform = 'translate(-40%, -50%) scale(0)';
    setTimeout(() => {
      sourceElCopy.remove();
    }, 400);
  }, 1);
};

const setCartCount = count => {
  const countEl = document.querySelector('.cart-count');
  countEl.textContent = count;
  if (count > 0) {
    countEl.classList.remove('hidden');
  } else {
    countEl.classList.add('hidden');
  }
};

const toastOrder = () => {
  const orderToast = createEl('div', 'order-toast');
  orderToast.append(createEl('p', null, 'Order sent!'));
  document.body.append(orderToast);
  setTimeout(() => {
    orderToast.style.opacity = 1;
    orderToast.style.bottom = '20%';
    setTimeout(() => {
      orderToast.style.opacity = 0;
      setTimeout(() => {
        orderToast.remove();
      }, 500);
    }, 2000);
  }, 1);
};
