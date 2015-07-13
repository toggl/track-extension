/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false, createTag: false*/
'use strict';

function insertAfter(newNode, referenceNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

togglbutton.render('#gqItemList .gq-item-row:not(.toggl)', {observe: true}, function (elem) {
  var link,
    container = createTag('div', 'taskItem-toggl'),
    titleElem = $('.gq-i-description', elem),
    projectContainer = $('.gq-queue-container.selected .gq-queue-name');

  if (titleElem) {
    link = togglbutton.createTimerLink({
      className: 'gqueues',
      buttonType: 'minimal',
      description: titleElem.innerText,
      projectName: projectContainer.innerText
    });

    container.appendChild(link);
    container.style.paddingTop = "5px"; // move button 5px down
    insertAfter(container, titleElem);
  }
});