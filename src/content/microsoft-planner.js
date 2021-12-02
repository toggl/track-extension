'use strict';

togglbutton.render('.taskCard:not(.toggl)', { observe: true }, function (elem) {
  const description = $('.title', elem).textContent;

  function getProject () {
    const plannerTaskboardName = $('.planTaskboardPage .primaryTextSection h1');
    const planName = $('.planName', elem);

    if (plannerTaskboardName) {
      return plannerTaskboardName.textContent;
    }
    if (planName) {
      return planName.textContent;
    }
  }

  const link = togglbutton.createTimerLink({
    className: 'microsoftplanner',
    description: description,
    projectName: getProject,
    buttonType: 'minimal'
  });
  $('.leftSection', elem).appendChild(link);
});
