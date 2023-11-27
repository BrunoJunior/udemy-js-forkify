import icons from 'url:../../img/icons.svg';

const parentElement = document.querySelector('.search-results .pagination');

/**
 * Getting the left button
 * @param {number} page
 * @return {string}
 */
function buttonLeftHtml(page) {
  if (page <= 1) {
    return '';
  }
  return `<button class='btn--inline pagination__btn--prev'>
        <svg class='search__icon'>
          <use href='${icons}#icon-arrow-left'></use>
        </svg>
        <span>Page ${page - 1}</span>
      </button>`;
}

/**
 * Getting the right button
 * @param {number} page
 * @param {number} numberOfPages
 * @return {string}
 */
function buttonRightHtml(page, numberOfPages) {
  if (page >= numberOfPages) {
    return '';
  }
  return `<button class='btn--inline pagination__btn--next'>
        <span>Page ${page + 1}</span>
        <svg class='search__icon'>
          <use href='${icons}#icon-arrow-right'></use>
        </svg>
      </button>`;
}

/**
 * Render the pagination
 * @param {number} page
 * @param {number} numberOfPages
 */
function render(page, numberOfPages) {
  parentElement.innerHTML = buttonLeftHtml(page) + buttonRightHtml(page, numberOfPages);
}


/**
 * Add a handler on change of pagination event
 * The direction is given to the handler (-1 previous page, 1 next page)
 * @param {function(number):void} handler
 */
function addHandleUpdatePagination(handler) {
  parentElement.addEventListener('click', (ev) => {
    const button = ev.target.closest('.btn--inline');
    const direction = button.classList.contains('pagination__btn--prev') ? -1 : 1;
    handler(direction);
  });
}

export { render, addHandleUpdatePagination };