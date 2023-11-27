import * as HPromise from './HPromise';
import * as Config from '../config';

const URL = 'https://forkify-api.herokuapp.com/api/v2';

/**
 * An ingredient
 * @typedef {{
 *   description: string,
 *   quantity: number|null,
 *   unit: string
 * }} Ingredient
 */

/**
 * A recipe.
 * @typedef {{
 *   cooking_time: number,
 *   id: string,
 *   image_url: string,
 *   ingredients: Ingredient[],
 *   publisher: string,
 *   servings: number,
 *   source_url: string,
 *   title: string
 * }} Recipe
 */

/**
 * A lite recipe
 * @typedef {{
 *    id: string,
 *    image_url: string,
 *    publisher: string,
 *    title: string
 * }} LiteRecipe
 */

/**
 * Function to generate an api url
 * @param {string} entrypoint
 * @param {Object.<string,string>} params
 * @return {string}
 */
function generateUrl(entrypoint, params = {}) {
  return Object.entries(params)
    .map(entry => [entry[0], encodeURIComponent(entry[1])])
    .reduce(
      (url, entry) => url + `&${entry[0]}=${entry[1]}`,
      `${URL}/${entrypoint}?key=${Config.API_KEY}`
    );
}

/**
 *
 * @param {Response} response
 * @param {undefined|string} errorMsg
 */
async function checkResponse(response, errorMsg = undefined) {
  const result = await response.json();
  if (!response.ok || result?.status !== 'success') {
    throw new Error(result?.message || errorMsg || response.statusText);
  }
  return result.data;
}

/**
 * Search for recipes
 * @param {string} value
 * @return {Promise<{LiteRecipe[]>}
 */
async function search(value) {
  const response = await HPromise.timeout(
    fetch(generateUrl('recipes', { search: value })),
    Config.DEFAULT_API_TIMEOUT
  );
  const checkedResponse = await checkResponse(response, 'Error during recipes search!');
  if (!Array.isArray(checkedResponse?.recipes) || checkedResponse.recipes.length === 0) {
    throw Error("No recipes found! Please try again!")
  }
  return checkedResponse.recipes;
}

/**
 * Getting one recipe from its id
 * @param {string} recipeId
 * @return {Promise<Recipe>}
 */
async function get(recipeId) {
  const securedId = encodeURIComponent(recipeId);
  const response = await HPromise.timeout(
    fetch(generateUrl(`recipes/${securedId}`)),
    Config.DEFAULT_API_TIMEOUT
  );
  return (await checkResponse(response, 'Error during getting recipe!')).recipe;
}


/**
 * Add a new personal recipe
 * @param {Recipe} recipe
 * @return {Promise<void>}
 */
async function add(recipe) {
  const response = await HPromise.timeout(fetch(
    generateUrl(`recipes`), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recipe)
    }), Config.DEFAULT_API_TIMEOUT);
  return checkResponse(response, 'Error during recipe creation!');
}

/**
 * Delete a personal recipe
 * @param {string} recipeId
 * @return {Promise<*|undefined>}
 */
async function remove(recipeId) {
  const securedId = encodeURIComponent(recipeId);
  const response = await HPromise.timeout(fetch(
    generateUrl(`recipes/${securedId}`),
    { method: 'DELETE' }
  ), Config.DEFAULT_API_TIMEOUT);
  return checkResponse(response, 'Error during recipe deletion!');
}

export { search, get, add, remove };