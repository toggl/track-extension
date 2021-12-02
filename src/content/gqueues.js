'use strict';

function insertAfter (newNode, referenceNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

togglbutton.render(
  '#gqItemList .gq-item-row:not(.toggl)',
  { observe: true },
  function (elem) {
    let link;
    const container = createTag('div', 'taskItem-toggl');
    const titleElem = $('.gq-i-description', elem);
    const projectContainer = $('.gq-queue-container.selected .gq-queue-name');

    if (titleElem) {
      link = togglbutton.createTimerLink({
        className: 'gqueues',
        buttonType: 'minimal',
        description: titleElem.textContent,
        projectName: projectContainer.textContent
      });

      container.appendChild(link);
      container.style.paddingTop = '5px'; // move button 5px down
      insertAfter(container, titleElem);
    }
  }
);
