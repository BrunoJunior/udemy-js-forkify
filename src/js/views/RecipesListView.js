import * as View from './View';

const parentElement = document.querySelector('.search-results .results');

/**
 *
 * @param {LiteRecipe|undefined} selectedRecipe
 * @return {(LiteRecipe)=>string}
 */
function renderLi(selectedRecipe) {
  // FIXME - manage user specific recipe
  return (recipe) => `<li class='preview'>
        <a class='preview__link ${recipe.id === selectedRecipe?.id ? "preview__link--active" : ""}' href='#${recipe.id}'>
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

/**
 * Render the recipes and change the display depending on the selected one
 * @param {LiteRecipe[]} recipes
 * @param {LiteRecipe|undefined} selectedRecipe
 */
function render(recipes, selectedRecipe = undefined) {
  parentElement.innerHTML = recipes.map(renderLi(selectedRecipe)).join('\n');
}

/**
 * Update the recipes and change the display depending on the selected one
 * @param {LiteRecipe[]} recipes
 * @param {LiteRecipe|undefined} selectedRecipe
 */
function update(recipes, selectedRecipe = undefined) {
  View.updateHtml(parentElement, recipes.map(renderLi(selectedRecipe)).join('\n'))
}

/**
 * Render the error div
 * @param {string|undefined} errorMessage
 * @return {string}
 */
function renderError(errorMessage = undefined) {
  View.renderError(parentElement, errorMessage || 'No recipes found for your query. Please try again!');
}

export { render, renderSpinner, renderError, update };