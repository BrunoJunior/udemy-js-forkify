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
export const state = {
  recipe: undefined,
  search: {
    query: '',
    result: []
  },
  pagination: {
    page: 1,
    nbPages: 1
  },
  bookmarks: new Map()
};

/**
 * Load a recipe in the state
 * @param id
 * @return {Promise<void>}
 */
export async function loadRecipe(id) {
  if (!id) {
    return;
  }
  state.recipe = await ForkifyApi.get(id);
  state.recipe.bookmarked = isBookmarked(state.recipe);
}


/**
 * Search the recipes and store them into the store
 * @param query
 * @return {Promise<void>}
 */
export async function searchRecipes(query) {
  state.search.query = query;
  state.search.result = !query ? [] : await ForkifyApi.search(query);
  state.pagination.page = 1;
  state.pagination.nbPages = Math.ceil(state.search.result.length / PAGINATION_MAX_BY_PAGE) || 1;
}

/**
 * Change the page of pagination
 * @param {-1|1} direction
 */
export function updatePaginationPage(direction) {
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
export function getPaginatedRecipes() {
  const endAt = state.pagination.page * PAGINATION_MAX_BY_PAGE;
  return state.search.result.slice(endAt - PAGINATION_MAX_BY_PAGE, endAt);
}

/**
 * Update the servings number +/- 1
 * @param {-1|1} direction
 */
export function updateServings(direction) {
  if (!state.recipe) {
    return;
  }
  const newServing = state.recipe.servings + direction;
  if (newServing === 0) {
    return;
  }
  const ratio = newServing / state.recipe.servings;
  state.recipe.servings = newServing;
  // Calculate the ingredients
  state.recipe.ingredients
    .filter((ingredient) => !!ingredient.quantity)
    .forEach((ingredient) => { ingredient.quantity *= ratio });
}

/**
 * Bookmark a recipe
 * @param {Recipe} recipe
 */
export function toggleBookmark(recipe) {
  const actualBookmarked = isBookmarked(recipe);
  if (actualBookmarked) {
    state.bookmarks.delete(recipe.id);
  } else {
    state.bookmarks.set(recipe.id, recipe);
  }
  if (recipe.id === state.recipe.id) {
    recipe.bookmarked = !actualBookmarked;
  }
}

/**
 * Is the recipe bookmarked
 * @param {Recipe} recipe
 * @return {boolean}
 */
export function isBookmarked(recipe) {
  return state.bookmarks.has(recipe.id);
}