import * as ForkifyApi from './helpers/ForkifyApi';
import { PAGINATION_MAX_BY_PAGE } from './config';

/**
 *
 * @type {{
 * recipe: Recipe|undefined,
 * search: {query: string, result: LiteRecipe[]},
 * pagination: {page: number, nbPages: number}
 * }}
 */
const state = {
  recipe: undefined,
  search: {
    query: '',
    result: []
  },
  pagination: {
    page: 1,
    nbPages: 1
  }
};

/**
 * Load a recipe in the state
 * @param id
 * @return {Promise<void>}
 */
async function loadRecipe(id) {
  if (!id) {
    return;
  }
  state.recipe = await ForkifyApi.get(id);
}


/**
 * Search the recipes and store them into the store
 * @param query
 * @return {Promise<void>}
 */
async function searchRecipes(query) {
  state.search.query = query;
  state.search.result = !query ? [] : await ForkifyApi.search(query);
  state.pagination.page = 1;
  state.pagination.nbPages = Math.ceil(state.search.result.length / PAGINATION_MAX_BY_PAGE) || 1;
}

/**
 * Change the page of pagination
 * @param {number} direction
 */
function updatePaginationPage(direction) {
  state.pagination.page += direction;
  if (state.pagination.page < 1) {
    state.pagination.page = 1;
  } else if (state.pagination.page > state.pagination.nbPages) {
    state.pagination.page = state.pagination.nbPages;
  }
}

/**
 * The recipes for the current pagination
 * @return {LiteRecipe[]}
 */
function getPaginatedRecipes() {
  const endAt = state.pagination.page * PAGINATION_MAX_BY_PAGE;
  return state.search.result.slice(endAt - PAGINATION_MAX_BY_PAGE, endAt);
}

export { state, loadRecipe, searchRecipes, updatePaginationPage, getPaginatedRecipes };