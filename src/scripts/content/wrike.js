'use strict';

togglbutton.render(
  '.task-view-header__main:not(.toggl)',
  { observe: true },
  function (elem) {
    const container = $('.task-view-header__actions', elem);

    const getTitle = function () {
      const wsTaskTitle = document.querySelectorAll('div.title__ghost');

      if (wsTaskTitle.length === 1 && wsTaskTitle[0].textContent !== '') {
        return wsTaskTitle[0].textContent.trim();
      } else {
        const wsDocumentTitles = $('title');
        if (wsDocumentTitles.length >= 1 && wsDocumentTitles[0].textContent !== '') {
          return wsDocumentTitles[0].textContent.trim().replace(' - Wrike', '');
        }
      }
      return 'not found';
    };
    
    const getTaskId = function () {
      const wsTaskId = document.querySelectorAll('div.task-author__task-id');

      if (wsTaskId.length === 1 && wsTaskId[0].textContent !== '') {
        return wsTaskId[0].textContent;
      }
      return '';
    };  

    const descriptionText = function () {
      const taskId = getTaskId();
      const titleText = getTitle();
      return `${taskId} ${titleText}`.trim();
    };

    const projectText = function () {
      const projectElem = $('.wspace-tag-simple', elem);
      // We process the project element text content.
      return projectElem ? projectElem.textContent : '';
    };

    const link = togglbutton.createTimerLink({
      className: 'wrike',
      description: descriptionText,
      projectName: projectText
    });

    container.insertBefore(link, container.firstChild);
  }
);
