'use strict';

togglbutton.render(
  '.document-name-container:not(.toggl)',
  { observe: true },
  function(elem) {
    var link,
      description = $('.navbar-document-version', elem).textContent,
      project = $('.navbar-document-name', elem).textContent;

    link = togglbutton.createTimerLink({
      className: 'onshape',
      description: description,
      projectName: project,
      buttonType: 'minimal'
    });

    $('.navbar-document-and-workspace-names').appendChild(link);
  }
);
