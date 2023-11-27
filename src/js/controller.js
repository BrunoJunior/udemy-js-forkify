import * as Model from './Model';
import * as RecipeView from './views/RecipeView';
import * as RecipesListView from './views/RecipesListView';
import * as SearchView from './views/SearchView';
import * as PaginationView from './views/PaginationView';

///////////////////////////////////////

/**
 * Display the selected recipe
 * @return {Promise<void>}
 */
async function displayRecipe() {
  try {
    RecipeView.renderSpinner();
    await Model.loadRecipe(window.location.hash?.slice(1));
    if (!Model.state.recipe) {
      RecipeView.renderNoRecipe();
      return;
    }
    RecipeView.render(Model.state.recipe);
  } catch (e) {
    RecipeView.renderError();
  }
}

/**
 * Updating the list view depending on the pagination
 */
function updateRecipesList() {
  RecipesListView.render(Model.getPaginatedRecipes());
  PaginationView.render(Model.state.pagination.page, Model.state.pagination.nbPages);
}

/**
 * Display the list of recipes
 * @return {Promise<void>}
 */
async function displayRecipesList() {
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
function updatePagination(direction) {
  Model.updatePaginationPage(direction);
  updateRecipesList();
}

RecipeView.addHandlerRender(displayRecipe);
SearchView.addHandleSearch(displayRecipesList);
PaginationView.addHandleUpdatePagination(updatePagination);
