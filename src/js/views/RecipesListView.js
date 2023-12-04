import * as View from './View';
import * as PreviewView from './PreviewView';

const parentElement = document.querySelector('.search-results .results');

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

/**
 * Render the error div
 * @param {string|undefined} errorMessage
 * @return {string}
 */
function renderError(errorMessage = undefined) {
  View.renderError(parentElement, errorMessage || 'No recipes found for your query. Please try again!');
}

export { render, renderSpinner, renderError, update };