import * as View from './View';

/**
 *
 * @param {LiteRecipe|undefined} selectedRecipe
 * @return {(LiteRecipe)=>string}
 */
function renderLi(selectedRecipe = undefined) {
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
 * Render the recipes and change the display depending on the selected one
 * @param {HTMLElement} parentElement
 * @param {LiteRecipe[]} recipes
 * @param {LiteRecipe|undefined} selectedRecipe
 */
export function render(parentElement, recipes, selectedRecipe = undefined) {
  if (recipes.length === 0) {
    View.renderError(parentElement, 'No bookmarks yet. Find a nice recipe and bookmark it :)', 'icon-smile')
  } else {
    parentElement.innerHTML = recipes.map(renderLi(selectedRecipe)).join('\n');
  }
}

/**
 * Update the recipes and change the display depending on the selected one
 * @param {HTMLElement} parentElement
 * @param {LiteRecipe[]} recipes
 * @param {LiteRecipe|undefined} selectedRecipe
 */
export function update(parentElement, recipes, selectedRecipe = undefined) {
  View.updateHtml(parentElement, recipes.map(renderLi(selectedRecipe)).join('\n'))
}