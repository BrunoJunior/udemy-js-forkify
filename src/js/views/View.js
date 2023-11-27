import icons from 'url:../../img/icons.svg';

/**
 * Render the spinner
 * @return {string}
 */
function renderSpinner(parentElement) {
  parentElement.innerHTML = `<div class='spinner'>
      <svg>
        <use href='${icons}#icon-loader'></use>
      </svg>
    </div>`;
}

/**
 * Render the error div
 * @param {Element} parentElement
 * @param {string|undefined} errorMessage
 * @return {string}
 */
function renderError(parentElement, errorMessage = undefined) {
  const message = errorMessage || 'No recipes found for your query. Please try again!';
  parentElement.innerHTML = `<div class='error'>
        <div>
          <svg>
            <use href='${icons}#icon-alert-triangle'></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>`;
}

export { renderSpinner, renderError };