/*
Listen to dispatched Event shout.
Add to the page caught shout with author name and text.
Add to the page the list of authors with the count of shouts.
BONUS:
On each new Event shout the new element should be highlighted for 1 second
Add ability to stop event dispatching
*/
import {
  startDispatching,
  stopDispatching,
} from './tourette.js';

// stores all authors with corresponding numbers of shouts
const authorsListState = new Map();

// stores all necessary references to DOM elements
const elements = new Map([
  ['content', document.querySelector('.content')],
  ['buttonBar', document.querySelector('.btn-bar')],
  ['currentAuthor', document.querySelector('.authors-current')],
  ['authorsList', document.querySelector('.authors-list')],
  // use getElementsByClassName to store live collection of LI elements
  ['authorsListItems', document.getElementsByClassName('.authors-list_item')],
  ['statusMessage', document.querySelector('.status')],
]);

const appendListItem = () => {
  const item = document.createElement('LI');
  item.classList.add('.authors-list_item');
  elements.get('authorsList').appendChild(item);
};

const updateAuthorsList = (author) => {
  if (authorsListState.has(author)) {
    // if the author shouted earlier increase the shouts counter
    const timesShouted = authorsListState.get(author) + 1;
    authorsListState.set(author, timesShouted);
  } else {
    authorsListState.set(author, 1); // else author shouts for the first time
    appendListItem(); // append new element to DOM if there's a new author
  }
};

const renderCurrentAuthor = (author, text) => {
  const currentAuthorElement = elements.get('currentAuthor');
  currentAuthorElement.textContent = `${author} has just shouted the phrase "${text}"`;
  // highlight text for 1 second
  currentAuthorElement.classList.add('is-text-highlighted');
  setTimeout(() => {
    currentAuthorElement.classList.remove('is-text-highlighted');
  }, 1000);
};

const renderAuthorsList = () => {
  const listElements = elements.get('authorsListItems');
  const authorsIterator = authorsListState.entries();
  for (const element of listElements) {
    // iterator.next().value returns key and value in a form of array
    const [author, counter] = authorsIterator.next().value;
    element.textContent = `${author} shouted ${counter} times`;
  }
};

const renderStatusMessage = (isDispatchingEnabled) => {
  const statusMessageElement = elements.get('statusMessage');
  if (isDispatchingEnabled) {
    statusMessageElement.innerHTML = 'Dispatching is now <span class="is-text-green">enabled</span>. You can turn it off.';
  } else {
    statusMessageElement.innerHTML = 'Dispatching is now <span class="is-text-red">disabled</span>. You can turn it on.';
  }
};

const animateContentBlockExpansion = () => {
  elements.get('content').classList.add('content-expanded');
};

const onAuthorShout = (event) => {
  const { author, text } = event.detail;
  renderCurrentAuthor(author, text);
  updateAuthorsList(author);
  renderAuthorsList();
};

const onBtnClick = (event) => {
  event.preventDefault();
  event.stopPropagation();
  if (event.target.classList.contains('btn-bar_start')) {
    animateContentBlockExpansion();
    renderStatusMessage(true);
    startDispatching(elements.get('currentAuthor'));
  } else if (event.target.classList.contains('btn-bar_stop')) {
    renderStatusMessage(false);
    stopDispatching();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  elements.get('currentAuthor').addEventListener('shout', onAuthorShout);
  elements.get('buttonBar').addEventListener('click', onBtnClick);
});
