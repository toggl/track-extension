'use strict';
/* global createTag */

togglbutton.render(
  '.window-header:not(.toggl)',
  { observe: true },
  (elem) => {
    const descriptionElem = $('.js-move-card');
    if (!descriptionElem) {
      return;
    }

    const getDescription = () => {
      return $('.window-title h2', elem).textContent.trim();
    };

    const getProject = () => {
      return $('.board-header-btn-name').textContent.trim();
    };

    const container = createTag('div', 'button-link trello-tb-wrapper');
    const link = togglbutton.createTimerLink({
      className: 'trello',
      description: getDescription,
      projectName: getProject
    });

    // Pass through click on Trello button to the timer link
    container.addEventListener('click', (e) => {
      e.preventDefault();
      link.click();
    });

    container.appendChild(link);
    descriptionElem.parentNode.insertBefore(container, descriptionElem);
  },
  '.window-wrapper'
);

/* Checklist buttons */
togglbutton.render(
  '.checklist-item-details:not(.toggl)',
  { observe: true },
  (elem) => {
    const titleElem = $('.window-title h2');
    const taskElem = $('.checklist-item-details-text', elem);

    const getProject = () => {
      return $('.board-header-btn-name').textContent.trim();
    };

    const link = togglbutton.createTimerLink({
      className: 'trello-list',
      buttonType: 'minimal',
      projectName: getProject,
      description: titleElem.textContent + ' - ' + taskElem.textContent
    });

    link.classList.add('checklist-item-menu');
    elem.querySelector('.checklist-item-menu-wrapper').appendChild(link);
  },
  '.checklist-items-list, .window-wrapper'
);
