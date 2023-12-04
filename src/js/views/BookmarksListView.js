import * as PreviewView from './PreviewView';

const parentElement = document.querySelector('.bookmarks .bookmarks__list');

/**
 * Render the bookmarked recipes
 * @param {Recipe[]} recipes
 * @param {Recipe|undefined} selectedRecipe
 */
function render(recipes, selectedRecipe = undefined) {
  PreviewView.render(parentElement, recipes, selectedRecipe);
}

/**
 * Update the recipes and change the display depending on the selected one
 * @param {LiteRecipe[]} recipes
 * @param {LiteRecipe|undefined} selectedRecipe
 */
function update(recipes, selectedRecipe = undefined) {
  PreviewView.update(parentElement, recipes, selectedRecipe);
}

export { render, update };