'use strict';

togglbutton.render(
  '.window-header:not(.toggl)',
  { observe: true },
  function(elem) {
    var link,
      container = createTag('div', 'button-link trello-tb-wrapper'),
      //duration,
      descFunc,
      titleElem = $('.window-title h2', elem),
      //trackedContainer = createTag('div', 'toggl-tracked'),
      //trackedElem = $('.other-actions'),
      projectElem = $('.board-header > a') || $('board-header-btn-name'),
      descriptionElem = $('.js-move-card');

    if (!descriptionElem) {
      return;
    }

    descFunc = function() {
      return titleElem.textContent;
    };

    link = togglbutton.createTimerLink({
      className: 'trello',
      description: descFunc,
      projectName: projectElem && projectElem.textContent,
      calculateTotal: true
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
  function(elem) {
    var link,
      projectElem = $('.board-header > a'),
      titleElem = $('.window-title h2'),
      taskElem = $('.checklist-item-details-text', elem);

    link = togglbutton.createTimerLink({
      className: 'trello',
      buttonType: 'minimal',
      projectName: projectElem.textContent,
      description: titleElem.textContent + ' - ' + taskElem.textContent
    });

    link.classList.add('checklist-item-button');
    elem.parentNode.appendChild(link);
  },
  '.checklist-items-list, .window-wrapper'
);
