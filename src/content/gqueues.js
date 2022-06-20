/**
 * @name GQueues
 * @urlAlias gqueues.com
 * @urlRegex *://*.gqueues.com/*
 */
 'use strict';

function insertAfter (newNode, referenceNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

togglbutton.render(
  '#gqItemList .gq-task-row:not(.toggl)',
  { observe: true },
  function (elem) {
    let link;
    const container = createTag('div', 'taskItem-toggl');
    const titleElem = $('.gq-task-title', elem);
    const projectContainer = $('#gqQueueContentHeader #gqQueueTitle input') || {};

    if (titleElem) {
      link = togglbutton.createTimerLink({
        className: 'gqueues',
        buttonType: 'minimal',
        description: () => {
          return titleElem.textContent
        },
        projectName: () => {
          return projectContainer.value
        }
      });

      container.appendChild(link);
      container.style.paddingTop = '5px'; // move button 5px down
      insertAfter(container, titleElem);
    }
  }
);
