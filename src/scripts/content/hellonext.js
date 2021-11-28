'use strict';

togglbutton.render(
  '.feedback-wrapper > div:not(.d-flex) .text-muted.smaller:not(.toggl)',
  { observe: true },
  function (elem) {
    const description = function () {
      return document.querySelector('.feedback-wrapper h5.feedback-single-title').textContent;
    };

    const project = function () {
      const projectSelect = document.querySelector('#bucket');
      return projectSelect.options[projectSelect.selectedIndex].textContent;
    };

    const link = togglbutton.createTimerLink({
      className: 'hellonext',
      description: description,
      projectName: project
    });

    elem.appendChild(link, elem);
  });
