/**
 * @name Taiga
 * @urlAlias taiga.io
 * @urlRegex *://*.taiga.io/*
 */
'use strict';

/* Epic/User story/Task/Issue details button */
togglbutton.render(
  '.detail-title-wrapper:not(.toggl)',
  { observe: true },
  function (elem) {
    const projectElem = $('tg-legacy-loader').shadowRoot.querySelector('.menu-option-text.project-name');
    const refElem = $('.detail-ref', elem);
    const titleElem = $('.detail-title-text > span', elem);

    const link = togglbutton.createTimerLink({
      className: 'taiga',
      buttonType: 'minimal',
      projectName: projectElem.textContent,
      description: refElem.textContent.trim() + ' ' + titleElem.textContent
    });

    elem.insertBefore(link, $('.detail-title-text', elem));
  }
);

/* Epics Dashboard */
togglbutton.render('.epic-row .name:not(.toggl)', { observe: true }, function (
  elem
) {
  const titleElem = $('a', elem);
  const projectElem = $('.epics .project-name');

  const link = togglbutton.createTimerLink({
    className: 'taiga',
    buttonType: 'minimal',
    description: titleElem.textContent,
    projectName: projectElem.textContent
  });

  elem.insertBefore(link, $('a', elem));
});

/* Backlog buttons */
togglbutton.render('.user-story-name:not(.toggl)', { observe: true }, function (
  elem
) {
  const projectElem = $('.backlog .project-name');
  const refElem = $('a > span:nth-child(1)', elem);
  const taskElem = $('a > span:nth-child(2)', elem);

  const link = togglbutton.createTimerLink({
    className: 'taiga',
    buttonType: 'minimal',
    projectName: projectElem.textContent,
    description: refElem.textContent.trim() + ' ' + taskElem.textContent
  });

  elem.insertBefore(link, $('a', elem));
});

/* Kanban buttons */
togglbutton.render(
  '.kanban .card-title:not(.toggl)',
  { observe: true },
  function (elem) {
    const refElem = $('a > span:nth-child(1)', elem);
    const titleElem = $('a > span:nth-child(2)', elem);
    const projectElem = $('.kanban .project-name');

    const link = togglbutton.createTimerLink({
      className: 'taiga',
      buttonType: 'minimal',
      description: refElem.textContent + ' ' + titleElem.textContent,
      projectName: projectElem.textContent
    });

    elem.insertBefore(link, $('a', elem));
  }
);

/* Sprint Taskboard tasks buttons */
togglbutton.render(
  '.taskboard .card-title:not(.toggl)',
  { observe: true },
  function (elem) {
    const refElem = $('.card-title > a > span:nth-child(1)', elem);
    const titleElem = $('.card-title > a > span:nth-child(2)', elem);
    const projectElem = $('.taskboard .project-name-short');

    const link = togglbutton.createTimerLink({
      className: 'taiga',
      buttonType: 'minimal',
      description: refElem.textContent.trim() + ' ' + titleElem.textContent,
      projectName: projectElem ? projectElem.textContent : 'kva'
    });

    elem.insertBefore(link, $('a', elem));
  }
);

/* Issues list buttons */
togglbutton.render(
  '.issues-table .row:not(.toggl)',
  { observe: true },
  function (elem) {
    const projectElem = $('.issues-page .project-name');
    const refElem = $('a > span:nth-child(1)', elem);
    const taskElem = $('a > span:nth-child(2)', elem);

    const link = togglbutton.createTimerLink({
      className: 'taiga',
      buttonType: 'minimal',
      projectName: projectElem ? projectElem.textContent : 'kva',
      description: refElem.textContent.trim() + ' ' + taskElem.textContent
    });

    elem.insertBefore(link, $('.subject', elem));
  }
);
