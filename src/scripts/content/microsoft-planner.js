'use strict';

togglbutton.render('.taskCard:not(.toggl)', { observe: true }, function(elem) {
  var link,
    description = $('.title', elem).textContent;

  function getProject() {
    var plannerTaskboardName = $('.planTaskboardPage .primaryTextSection h1'),
      planName = $('.planName', elem);

    if (plannerTaskboardName) {
      return plannerTaskboardName.textContent;
    }
    if (planName) {
      return planName.textContent;
    }
    return;
  }

  link = togglbutton.createTimerLink({
    className: 'microsoftplanner',
    description: description,
    projectName: getProject,
    buttonType: 'minimal'
  });
  $('.leftSection', elem).appendChild(link);
});
