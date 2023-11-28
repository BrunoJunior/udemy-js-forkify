import icons from 'url:../../img/icons.svg';
import fracty from 'fracty';
import * as View from './View';

const parentElement = document.querySelector('.recipe');

/**
 * Render an ingredient li
 * @param {Ingredient} ingredient
 */
function getIngredientHtml(ingredient) {
  const htmlQty = ingredient.quantity ? `<div class='recipe__quantity'>${fracty(ingredient.quantity)}</div>` : ``;
  return `<li class='recipe__ingredient'>
          <svg class='recipe__icon'>
            <use href='${icons}#icon-check'></use>
          </svg>
          ${htmlQty}
          <div class='recipe__description'>
            <span class='recipe__unit'>${ingredient.unit}</span>
            ${ingredient.description}
          </div>
        </li>`;
}

/**
 * Render a recipe zone
 * @param {Recipe} recipe
 * @return {string}
 */
function render(recipe) {
  parentElement.innerHTML = `<figure class='recipe__fig'>
      <img src='${recipe.image_url}' alt='${recipe.title}' class='recipe__img' />
      <h1 class='recipe__title'>
        <span>${recipe.title}</span>
      </h1>
    </figure>

    <div class='recipe__details'>
      <div class='recipe__info'>
        <svg class='recipe__info-icon'>
          <use href='${icons}#icon-clock'></use>
        </svg>
        <span class='recipe__info-data recipe__info-data--minutes'>${recipe.cooking_time}</span>
        <span class='recipe__info-text'>minutes</span>
      </div>
      <div class='recipe__info'>
        <svg class='recipe__info-icon'>
          <use href='${icons}#icon-users'></use>
        </svg>
        <span class='recipe__info-data recipe__info-data--people'>${recipe.servings}</span>
        <span class='recipe__info-text'>servings</span>

        <div class='recipe__info-buttons'>
          <button class='btn--tiny btn--decrease-servings'>
            <svg>
              <use href='${icons}#icon-minus-circle'></use>
            </svg>
          </button>
          <button class='btn--tiny btn--increase-servings'>
            <svg>
              <use href='${icons}#icon-plus-circle'></use>
            </svg>
          </button>
        </div>
      </div>

      <div class='recipe__user-generated'>
        <svg>
          <use href='${icons}#icon-user'></use>
        </svg>
      </div>
      <button class='btn--round'>
        <svg class=''>
          <use href='${icons}#icon-bookmark-fill'></use>
        </svg>
      </button>
    </div>

    <div class='recipe__ingredients'>
      <h2 class='heading--2'>Recipe ingredients</h2>
      <ul class='recipe__ingredient-list'>
        ${recipe.ingredients.map(getIngredientHtml).join('')}
      </ul>
    </div>

    <div class='recipe__directions'>
      <h2 class='heading--2'>How to cook it</h2>
      <p class='recipe__directions-text'>
        This recipe was carefully designed and tested by
        <span class='recipe__publisher'>${recipe.publisher}</span>. Please check out
        directions at their website.
      </p>
      <a
        class='btn--small recipe__btn'
        href='${recipe.source_url}'
        target='_blank'
      >
        <span>Directions</span>
        <svg class='search__icon'>
          <use href='${icons}#icon-arrow-right'></use>
        </svg>
      </a>
    </div>`;
}

/**
 * Render the error div
 * @param {string|undefined} errorMessage
 * @return {string}
 */
function renderError(errorMessage = undefined) {
  View.renderError(parentElement, errorMessage || 'No recipes found for your query. Please try again!');
}

/**
 * Render the spinner
 * @return {string}
 */
function renderSpinner() {
  View.renderSpinner(parentElement);
}

/**
 * Display the content when no recipe has been selected
 * @return {string}
 */
function renderNoRecipe() {
  parentElement.innerHTML = `<div class='message'>
      <div>
        <svg>
          <use href='${icons}#icon-smile'></use>
        </svg>
      </div>
      <p>Start by searching for a recipe or an ingredient. Have fun!</p>
    </div>
  </div>`;
}

/**
 * Add the given listener to the load and hashchange events
 * @param {function(Event): void} listener
 */
function addHandlerRender(listener) {
  window.addEventListener('load', listener);
  window.addEventListener('hashchange', listener);
}

/**
 * Add the given listener to the update servings event
 * @param {function(-1|1):void} listener
 */
function addHandlerUpdateServings(listener) {
  parentElement.addEventListener('click', function(evt) {
    const btnClicked = evt.target.closest('.recipe__info-buttons .btn--tiny');
    if (!btnClicked) {
      return;
    }
    const direction = btnClicked.classList.contains('btn--increase-servings') ? 1 : -1;
    listener(direction);
  });
}

export { render, renderError, renderSpinner, renderNoRecipe, addHandlerRender, addHandlerUpdateServings };