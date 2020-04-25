'use strict';
/* global togglbutton, $ */

// The bullet that has been interacted with most recently.
let recentBullet = null;

// The timer link (from createTimerLink).
// Must be global so that its title can be updated to reflect the bullet
// that has been interacted with most recently.
let link = null;

togglbutton.render(
  '.header:not(.toggl)',
  { observe: true },
  $container => {
    if ($container.querySelector('.toggl-button')) {
      // Check for existence in case it's there from a previous render
      return;
    }

    link = togglbutton.createTimerLink({
      className: 'workflowy',
      buttonType: 'minimal',
      description: getDescription,
      tags: getTags
    });

    $container.insertBefore(link, $container.children[3]);
  }
);

// Updates the bullet that has been interacted with most recently.
// Updates the link's title to match.
document.addEventListener('focusin', function (e) {
  const focus = document.activeElement;
  if (focus.className.includes('content')) {
    recentBullet = focus;
  }
  // TODO: May want to move this into a function in case toggl-button ever
  //   supports i18n.
  link.title = 'Start timer: ' + getDescription();
});

function getDescription () {
  // Current most recently focused bullet or top bullet.
  const bulletInfo = recentBullet || $('.content');

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

function getTags () {
  // Current most recently focused bullet or top bullet.
  const bulletInfo = recentBullet || $('.content');

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
