'use strict';

/*workitems / tasks view */
togglbutton.render('.edit-container:not(.toggl)', { observe: true }, function(
  elem
) {
  var link,
    titleEl = $('.header-title-container', elem),
    number = $('.token-number', titleEl).textContent,
    subject = $('.vk-editableText span', titleEl).textContent,
    descriptionFunc = function() {
      var task = $('.first-panel .vk-accordion-title', elem),
        taskText = task ? ' - ' + task.textContent : '',
        description = number + subject + taskText;

      return description;
    },
    project = $('#miAppsPopover').textContent;

  link = togglbutton.createTimerLink({
    className: 'heflo',
    description: descriptionFunc,
    projectName: project
  });

  $('.header-btn-container', elem).appendChild(link);
});

/*process editor view */
togglbutton.render(
  '.vk-mainDiagram:not(.toggl)',
  { observe: true },
  function() {
    var link,
      liTag = document.createElement('li'),
      descriptionFunc = function() {
        return window.document.title;
      },
      project = $('#miAppsPopover').textContent,
      lastEl = $('.navbar-nav');

    liTag.className = 'navbar-right toggl-container';

    link = togglbutton.createTimerLink({
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
