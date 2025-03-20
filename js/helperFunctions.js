'use strict';

const getJsonData = async path => {
  const result = await fetch(path);
  if (result.ok) {
    return await result.json();
  } else {
    throw Error('Error reading JSON-data');
  }
};

const createEl = (tag, className, text) => {
  const el = document.createElement(tag);
  if (className) el.classList.add(className);
  if (text) el.textContent = text;
  return el;
};

export { getJsonData, createEl };
