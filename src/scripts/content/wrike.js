'use strict';

togglbutton.render(
  '.task-view-header__main:not(.toggl)',
  { observe: true },
  function (elem) {
    const container = $('.task-view-header__actions', elem);

    const getTitleElement = function () {
      const wsTaskTitle = document.querySelectorAll('ws-task-title');
      if (wsTaskTitle.length === 1 && wsTaskTitle[0].textContent !== '') {
        return wsTaskTitle[0];
      }
      return $('title');
    };
    
    const getTaskId = function () {
      const urlString = window.location.href;
      const url = new URL(urlString); // We have to look for the param in a custom hash

      const hash = url.hash.substr(1);
      let indexBeginIdPart = hash.indexOf('?id=');
      if (indexBeginIdPart === -1){
        indexBeginIdPart = hash.indexOf('&id=');
      }
      if (indexBeginIdPart === -1){
        return null;
      } else {
        indexBeginIdPart = indexBeginIdPart + 4;
        const indexEndIdPart = hash.indexOf('&', indexBeginIdPart);
        if (indexEndIdPart === -1){
          return hash.slice(indexBeginIdPart);
        } else {
          return hash.slice(indexBeginIdPart, indexEndIdPart - 1); 
        }
      }
    };  

    const descriptionText = function () {

      const taskId = getTaskId();
      const titleElem = getTitleElement();
      const titleElemText = titleElem ? titleElem.textContent : 'not found';
      return `${taskId ? '#' + taskId : ''} ${titleElemText.trim().replace(' - Wrike', '')}`.trim();
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
