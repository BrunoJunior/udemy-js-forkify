import icons from 'url:../../img/icons.svg';

/**
 * Render the spinner
 * @return {string}
 */
export function renderSpinner(parentElement) {
  parentElement.innerHTML = `<div class='spinner'>
      <svg>
        <use href='${icons}#icon-loader'></use>
      </svg>
    </div>`;
}

/**
 * Render the error div
 * @param {Element} parentElement
 * @param {string|undefined} errorMessage
 * @return {string}
 */
export function renderError(parentElement, errorMessage = undefined) {
  const message = errorMessage || 'No recipes found for your query. Please try again!';
  parentElement.innerHTML = `<div class='error'>
        <div>
          <svg>
            <use href='${icons}#icon-alert-triangle'></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>`;
}

/**
 *
 * @param {HTMLElement} parentElement
 * @param {string} newContent
 */
export function updateHtml(parentElement, newContent) {
  const newDOM = document.createRange().createContextualFragment(newContent);
  const newElements = Array.from(newDOM.querySelectorAll('*'));
  const currentElements = Array.from(parentElement.querySelectorAll('*'));

  const changedElements = newElements
    .map((newElement, index) => ({newElement, oldElement: currentElements[index]}))
    .filter(({newElement, oldElement}) => !newElement.isEqualNode(oldElement))

  // Update the text values
  changedElements
    .filter(({newElement, oldElement}) => newElement.firstChild?.nodeType === Node.TEXT_NODE)
    .forEach(({newElement, oldElement}) => oldElement.innerHTML = newElement.innerHTML);

  // Update the attributes
  changedElements
    .map(({newElement, oldElement}) => ({oldElement, newAttributes: Array.from(newElement.attributes)}))
    .filter(({newAttributes, oldElement}) => newAttributes
      .reduce((isDiff, newAttribute, index) => {
        const oldAttr = Array.from(oldElement.attributes).at(index);
        return isDiff || oldAttr.name !== newAttribute.name || oldAttr.value !== newAttribute.value
      }, false))
    .forEach(({newAttributes, oldElement}) =>
      newAttributes.forEach(attribute => oldElement.setAttribute(attribute.name, attribute.value)));
}