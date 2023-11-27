const parentElement = document.querySelector('form.search');

/**
 * Get the search input
 * @return {HTMLInputElement}
 */
function getInput() {
  return parentElement.querySelector('input');
}

function getValue() {
  const value = getInput().value;
  getInput().value = '';
  return value;
}

/**
 * Add a handler on the search event
 * @param {function():void} handler
 */
function addHandleSearch(handler) {
  parentElement.addEventListener('submit', (ev) => {
    ev.preventDefault();
    handler();
  });
}

export { addHandleSearch, getValue };