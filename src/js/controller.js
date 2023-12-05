import * as Model from './Model';
import * as RecipeView from './views/RecipeView';
import * as RecipesListView from './views/RecipesListView';
import * as SearchView from './views/SearchView';
import * as PaginationView from './views/PaginationView';
import * as BookmarkListView from './views/BookmarksListView';

///////////////////////////////////////

/**
 * Display the selected recipe
 * @return {Promise<void>}
 */
async function controlRecipe() {
  try {
    RecipeView.renderSpinner();
    await Model.loadRecipe(window.location.hash?.slice(1));
    if (!Model.state.recipe) {
      RecipeView.renderNoRecipe();
      return;
    }
    RecipesListView.update(Model.getPaginatedRecipes(), Model.state.recipe);
    BookmarkListView.update(Model.getBookmarks(), Model.state.recipe);
    RecipeView.render(Model.state.recipe);
  } catch (e) {
    console.error(e);
    RecipeView.renderError();
  }
}

/**
 * Updating the list view depending on the pagination
 */
function updateRecipesList() {
  RecipesListView.render(Model.getPaginatedRecipes(), Model.state.recipe);
  PaginationView.render(Model.state.pagination.page, Model.state.pagination.nbPages);
}

/**
 * Display the list of recipes
 * @return {Promise<void>}
 */
async function controlRecipesList() {
  try {
    RecipesListView.renderSpinner();
    await Model.searchRecipes(SearchView.getValue());
    updateRecipesList();
  } catch (e) {
    RecipesListView.renderError();
  }
}

/**
 * The pagination was updated
 * @param {number} direction
 */
function controlPagination(direction) {
  Model.updatePaginationPage(direction);
  updateRecipesList();
}

/**
 * Listen to the event and rerender the recipe
 * @param {-1|1} direction
 */
function controlServings(direction) {
  if (!Model.state.recipe) {
    return;
  }
  Model.updateServings(direction);
  RecipeView.update(Model.state.recipe);
}

/**
 * Render the bookmark list view
 */
function controlDisplayBookmark() {
  BookmarkListView.render(Model.getBookmarks(), Model.state.recipe);
}

/**
 * Make some changes on bookmark toggle
 */
function controlToggleBookmark() {
  if (!Model.state.recipe) {
    return;
  }
  Model.toggleBookmark(Model.state.recipe);
  RecipeView.update(Model.state.recipe);
  controlDisplayBookmark()
}

/**
 * Init function (iife)
 */
(function init() {
  RecipeView.addHandlerRender(controlRecipe);
  RecipeView.addHandlerUpdateServings(controlServings);
  RecipeView.addHandlerToggleBookmark(controlToggleBookmark);
  SearchView.addHandleSearch(controlRecipesList);
  PaginationView.addHandleUpdatePagination(controlPagination);
  Model.addHandlerInitReady(controlDisplayBookmark);
})();


