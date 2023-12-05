import * as ForkifyApi from './helpers/ForkifyApi';
import { PAGINATION_MAX_BY_PAGE, LOCALSTORAGE_BOOKMARK_KEY, API_KEY } from './config';

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
  state.recipe.isMine = state.recipe.key === API_KEY;
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
 * Mark a recipe as bookmarked
 * @param recipe
 * @param isStorageToUpdate
 */
function bookmark(recipe, isStorageToUpdate = true) {
  state.bookmarks.set(recipe.id, recipe);
  if (isStorageToUpdate) {
    updateStorage();
  }
  if (recipe.id === state.recipe?.id) {
    state.recipe.bookmarked = true;
  }
}

/**
 * Remove a recipe from the bookmarked list
 * @param {Recipe} recipe
 */
function unbookmark(recipe) {
  state.bookmarks.delete(recipe.id);
  updateStorage();
  if (recipe.id === state.recipe?.id) {
    state.recipe.bookmarked = false;
  }
}

/**
 * Updating the local storage
 */
function updateStorage() {
  localStorage.setItem(LOCALSTORAGE_BOOKMARK_KEY, JSON.stringify(Array.from(state.bookmarks.keys())));
}

/**
 * Bookmark a recipe
 * @param {Recipe} recipe
 */
export function toggleBookmark(recipe) {
  if (isBookmarked(recipe)) {
    unbookmark(recipe)
  } else {
    bookmark(recipe);
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

/**
 *
 * @return {Recipe[]}
 */
export function getBookmarks() {
  return Array.from(state.bookmarks.values());
}

/**
 * Getting the bookmarks from the local storage
 * @return {Promise<void>}
 */
async function initModel() {
  const strBookmarks = localStorage.getItem(LOCALSTORAGE_BOOKMARK_KEY) || '[]';
  /**
   * List of ids
   * @type {number[]}
   */
  const bookmarked = JSON.parse(strBookmarks);
  if (!Array.isArray(bookmarked)) {
    return;
  }
  (await Promise.allSettled(bookmarked.map(ForkifyApi.get)))
    .filter(result => result.status === 'fulfilled')
    .map(result => result.value)
    .forEach(recipe => bookmark(recipe, false));
}

/**
 * Listen the ready model event
 * @param handler
 */
export function addHandlerInitReady(handler) {
  initModel().then(handler).catch(console.error);
}

/**
 * Adding a new recipe
 * @param {Recipe} recipe
 * @return {Promise<void>}
 */
export async function addNewRecipe(recipe) {
  state.recipe = await ForkifyApi.add(recipe);
  state.recipe.isMine = true;
  bookmark(state.recipe);
}