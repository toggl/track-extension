'use strict';

togglbutton.render(
  '.card_box:not(.toggl), .card-content:not(.toggl)',
  { observe: true },
  function (elem) {
    const project = $('.project_name_card');

    const link = togglbutton.createTimerLink({
      className: 'breeze',
      description: function () {
        let description = $('.card_name', elem);
        if (!description) {
          description = $('.card-name', elem);
        }
        return description && description.textContent.trim();
      },
      projectName: project && project.textContent.trim()
    });

    link.setAttribute('data-action', 'start-time-entry');
    $('.timer, .time-tracker', elem).appendChild(link);
  }
);
