import * as View from './View';

const parentElement = document.querySelector('.search-results .results');

/**
 *
 * @param {LiteRecipe} recipe
 * @return {string}
 */
function renderLi(recipe) {
  // FIXME - manage user specific recipe and active line
  return `<li class='preview'>
        <a class='preview__link' href='#${recipe.id}'>
<!--        <a class='preview__link preview__link&#45;&#45;active' href='#${recipe.id}'>-->
          <figure class='preview__fig'>
            <img src='${recipe.image_url}' alt='${recipe.title}' />
          </figure>
          <div class='preview__data'>
            <h4 class='preview__title'>${recipe.title}</h4>
            <p class='preview__publisher'>${recipe.publisher}</p>
<!--            <div class='preview__user-generated'>-->
<!--              <svg>-->
<!--                <use href='src/img/icons.svg#icon-user'></use>-->
<!--              </svg>-->
<!--            </div>-->
          </div>
        </a>
      </li>`;
}

/**
 * Render the spinner
 * @return {string}
 */
function renderSpinner() {
  View.renderSpinner(parentElement);
}

function render(recipes) {
  parentElement.innerHTML = recipes.map(renderLi).join('\n');
}

/**
 * Render the error div
 * @param {string|undefined} errorMessage
 * @return {string}
 */
function renderError(errorMessage = undefined) {
  View.renderError(parentElement, errorMessage || 'No recipes found for your query. Please try again!');
}

export { render, renderSpinner, renderError };