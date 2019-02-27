'use strict';

togglbutton.render(
  '.document-name-container:not(.toggl)',
  { observe: true },
  function (elem) {
    const description = $('.navbar-document-version', elem).textContent;
    const project = $('.navbar-document-name', elem).textContent;

    const link = togglbutton.createTimerLink({
      className: 'onshape',
      description: description,
      projectName: project,
      buttonType: 'minimal'
    });

    $('.navbar-document-and-workspace-names').appendChild(link);
  }
);
