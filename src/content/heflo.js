'use strict';

/* workitems / tasks view */
togglbutton.render('.edit-container:not(.toggl)', { observe: true }, function (
  elem
) {
  const titleEl = $('.header-title-container', elem);
  const number = $('.token-number', titleEl).textContent;
  const subject = $('.vk-editableText span', titleEl).textContent;

  const descriptionFunc = function () {
    const task = $('.first-panel .vk-accordion-title', elem);
    const taskText = task ? ' - ' + task.textContent : '';
    const description = number + subject + taskText;

    return description;
  };

  const project = $('#miAppsPopover').textContent;

  const link = togglbutton.createTimerLink({
    className: 'heflo',
    description: descriptionFunc,
    projectName: project
  });

  $('.header-btn-container', elem).appendChild(link);
});

/* process editor view */
togglbutton.render(
  '.vk-mainDiagram:not(.toggl)',
  { observe: true },
  function () {
    const liTag = document.createElement('li');

    const descriptionFunc = function () {
      return window.document.title;
    };

    const project = $('#miAppsPopover').textContent;
    const lastEl = $('.navbar-nav');

    liTag.className = 'navbar-right toggl-container';

    const link = togglbutton.createTimerLink({
      className: 'heflo',
      description: descriptionFunc,
      projectName: project
    });

    liTag.appendChild(link);
    lastEl.insertBefore(
      liTag,
      lastEl.querySelector('.navbar-save-button').nextSibling
    );
  }
);
