const parentElement = document.querySelector('.upload');
const closeModalButton = document.querySelector('.btn--close-modal');
const openModalButton = document.querySelector('.nav__btn--add-recipe');
const modalOverlay = document.querySelector('.overlay');
const recipeWindow = document.querySelector('.add-recipe-window');

let initialized = false;

/**
 * Toggle modal visibility
 */
function toggleModal() {
  modalOverlay.classList.toggle('hidden');
  recipeWindow.classList.toggle('hidden');
}

/**
 * Init function
 */
function init() {
  if (initialized) return;
  [closeModalButton, openModalButton, modalOverlay]
    .forEach(el => el.addEventListener('click', toggleModal));
  initialized = true;
}

/**
 * Transform the form data into a Recipe object
 * @return {Recipe}
 */
function formToRecipe() {
  const formData = new FormData(parentElement);
  const ingredients = Array.from(formData.entries())
    .filter(([key, value]) => key.startsWith('ingredient-') && value)
    .map(([_, value]) => ingredientStringToIngredient(value));
  return {
    publisher: formData.get('publisher'),
    title: formData.get('title'),
    servings: +formData.get('servings'),
    cooking_time: +formData.get('cookingTime'),
    image_url: formData.get('image'),
    source_url: formData.get('sourceUrl'),
    ingredients
  };
}

/**
 *
 * @param {string} ingredient
 * @return {Ingredient}
 */
function ingredientStringToIngredient(ingredient) {
  const [quantity, unit, description] = ingredient.split(',');
  if (!description) {
    throw new Error(`Please use the correct format "quantity,unit,description"`);
  }
  return { quantity: +quantity || null, unit: unit ?? '', description: description ?? '' };
}

/**
 * Clear the form
 */
function clearForm() {
  parentElement.querySelectorAll('input')
    .forEach(input => input.value = '');
}

/**
 * Add a handler on the form submission
 * @param {function(Recipe):void} handler
 */
export function addHandlerUpload(handler) {
  init();
  parentElement.addEventListener('submit', function(evt) {
    evt.preventDefault();
    try {
      handler(formToRecipe());
      clearForm();
      toggleModal();
    } catch (e) {
      console.error(e);
    }
  });
}