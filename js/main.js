'use strict';

import { setupScrollingNav } from './navScroll.js';
import { setupFoodLogic } from './food.js';
import { setupLunchModal } from './lunchModal.js';

setupScrollingNav();
setupFoodLogic('./data/food.json');
setupLunchModal();
