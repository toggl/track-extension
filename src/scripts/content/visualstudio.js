'use strict';

// Individual Work Item & Backlog page
togglbutton.render(
  '.witform-layout-content-container:not(.toggl)',
  { observe: true },
  function() {
    var link,
      description =
        $('.work-item-form-id span').innerText +
        ' ' +
        $('.work-item-form-title input').value,
      project = $('.tfs-selector span').innerText,
      container = $('.work-item-form-header-controls-container'),
      vs_activeClassContent = $(
        '.commandbar.header-bottom > .commandbar-item > .displayed'
      ).innerText;

    link = togglbutton.createTimerLink({
      className: 'visual-studio-online',
      description: description,
      projectName: project
    });

    if (
      vs_activeClassContent === 'Work Items' ||
      vs_activeClassContent === 'Backlogs'
    ) {
      container.appendChild(link);
    }
  }
);
