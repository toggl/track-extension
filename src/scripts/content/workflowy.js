'use strict';
/* global togglbutton, $ */

/* Hover on Bullet Popup */
togglbutton.render(
  // TODO: Change selector if the popup ever gets a constant class.
  '.name:not(.toggl) > div:not(.content)',
  { observe: true },
  $container => {
    const $bulletInfo = $('.content', $container.parentElement);

    const descriptionSelector = () => {
      return getDescription($bulletInfo);
    };

    const tagsSelector = () => {
      return getTags($bulletInfo);
    };

    const link = togglbutton.createTimerLink({
      className: 'workflowy',
      description: descriptionSelector,
      tags: tagsSelector
    });

    insertLink($container, link);
  }
);

/* More Options Menu Popup */
togglbutton.render(
  // TODO: Change selector if the popup ever gets a constant class.
  '.selected:not(.mainTreeRoot) ~ .pageControls > .pageMenu:not(.toggl) >' +
  ' div:nth-child(2)',
  { observe: true },
  $container => {
    // Get the content of the top bullet.
    const $bulletInfo = $('.content');

    const descriptionSelector = () => {
      return getDescription($bulletInfo);
    };

    const tagsSelector = () => {
      return getTags($bulletInfo);
    };

    const link = togglbutton.createTimerLink({
      className: 'workflowy',
      description: descriptionSelector,
      tags: tagsSelector
    });

    insertLink($container, link);
  }
);

function getDescription (bulletInfo) {
  let description = '';
  let currentNode = bulletInfo.childNodes[0];
  while (currentNode !== bulletInfo) {
    // If it is a text node.
    if (currentNode.nodeType === 3) {
      description += currentNode.textContent;
    }

    // Try to go down the tree.
    let nextNode = currentNode.firstChild || currentNode.nextSibling;
    // Span means it is a tag, and tag text should not be included.
    while (nextNode && nextNode.nodeName === 'SPAN') {
      nextNode = nextNode.nextSibling;
    }
    // If we couldn't go down try to go back up the tree.
    if (!nextNode) {
      nextNode = currentNode.parentNode;
      while (nextNode !== bulletInfo) {
        // We are valid again!
        if (nextNode.nextSibling) {
          nextNode = nextNode.nextSibling;
          break;
        }
        // Try to go up again. If we reach the bulletInfo node that
        // means we've reached the top and we will break out of both loops.
        nextNode = nextNode.parentNode;
      }
    }
    currentNode = nextNode;
  }
  return description.trim();
}

function getTags (bulletInfo) {
  const tagsArray = [];
  let currentNode = bulletInfo.childNodes[0];
  while (currentNode !== bulletInfo) {
    if (currentNode.classList &&
      currentNode.classList.contains('contentTagText')) {
      tagsArray.push(currentNode.textContent.trim());
    }

    // Try to go down the tree.
    let nextNode = currentNode.firstChild || currentNode.nextSibling;
    // If we can't go down try to go back up the tree.
    if (!nextNode) {
      nextNode = currentNode.parentNode;
      while (nextNode !== bulletInfo) {
        // We are valid again!
        if (nextNode.nextSibling) {
          nextNode = nextNode.nextSibling;
          break;
        }
        // Try to go up again. If we reach the bulletInfo node that
        // means we've reached the top and we will break out of both loops.
        nextNode = nextNode.parentNode;
      }
    }
    currentNode = nextNode;
  }
  return tagsArray;
}

function insertLink (popup, link) {
  const INSERT_POSITION = 3;

  /* Massage the DOM */
  const wrapper = document.createElement('div');
  wrapper.classList.add('workflowy-toggl-wrapper');
  // This makes sure the 'Start timer' link matches the style of the other
  // options (even when the theme is changed).
  wrapper.classList.add(popup.children[0].classList[0]);
  wrapper.appendChild(link);
  popup.insertBefore(wrapper, popup.children[INSERT_POSITION]);

  // We have to add the toggl class to the parent of the popup,
  // because the popup's classes get overwritten by workflowy.
  const parent = popup.parentElement;
  parent.classList.add('toggl');

  // And remove the class when the parent element's children change (meaning
  // the popup is deleted).
  const observer = new MutationObserver(function (mutationsList, observer) {
    parent.classList.remove('toggl');
    observer.disconnect();
  });
  observer.observe(parent, { childList: true });
}
