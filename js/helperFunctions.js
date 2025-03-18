'use strict';

const getJsonData = async path => {
  const result = await fetch(path);
  if (result.ok) {
    return await result.json();
  } else {
    throw Error('Error reading JSON-data');
  }
};

const createElement = (tag, className, text) => {
  const element = document.createElement(tag);
  if (className) element.classList.add(className);
  if (text) element.textContent = text;
  return element;
};

export { getJsonData, createElement };
