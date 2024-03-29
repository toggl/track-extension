/**
 * @name Trello
 * @urlAlias trello.com 
 * @urlRegex *://trello.com/*
 */
'use strict';
/* global createTag */

const getProject = () => {
  const project = document.querySelector('.board-header [data-testid="board-name-display"]')
  return project ? project.textContent.trim() : '';
};

const cardContainerSelector = '.card-detail-window';
togglbutton.render(
  '.window-header:not(.toggl)',
  { observe: true, debounceInterval: 300 },
  (elem) => {
    const actionButton =
      $('.js-move-card') ||
      $('.js-copy-card') ||
      $('.js-archive-card') ||
      $('.js-more-menu');

    if (!actionButton) {
      return;
    }

    const getDescription = () => {
      const description = $('.window-title h2', elem);
      return description ? description.textContent.trim() : '';
    };

    const container = createTag('div', 'button-link trello-tb-wrapper');
    const link = togglbutton.createTimerLink({
      className: 'trello',
      description: getDescription,
      projectName: getProject,
      container: cardContainerSelector
    });

    // Pass through click on Trello button to the timer link
    container.addEventListener('click', (e) => {
      e.preventDefault();
      link.click();
    });

    container.appendChild(link);
    actionButton.parentNode.insertBefore(container, actionButton);
  },
  cardContainerSelector
);

/* Checklist buttons */
togglbutton.render(
  '.checklist-item-details:not(.toggl)',
  { observe: true },
  (elem) => {
    const getTitleText = () => {
      const title = $('.window-title h2');
      return title ? title.textContent.trim() : '';
    };

    const getTaskText = () => {
      const task = $('.checklist-item-details-text', elem);
      return task ? task.textContent.trim() : '';
    };

    const getDescription = () => {
      return `${getTitleText()} - ${getTaskText()}`;
    };

    const link = togglbutton.createTimerLink({
      className: 'trello-list',
      buttonType: 'minimal',
      projectName: getProject,
      description: getDescription,
      container: cardContainerSelector
    });
    const wrapper = document.createElement('span');
    wrapper.classList.add('checklist-item-menu');
    wrapper.style.display = 'flex';
    wrapper.style.alignItems = 'center';
    wrapper.appendChild(link);
    elem.querySelector('.checklist-item-controls').appendChild(wrapper);
  },
  `.checklist-items-list, ${cardContainerSelector}`
);
