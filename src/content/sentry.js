'use strict';

togglbutton.render('.group-detail:not(.toggl)', { observe: true }, function (elem) {
  const pageTitle = $('title').textContent.trim();

  // Extract the project name from the page title, assuming it's the last part after ' — '
  const pageTitleParts = pageTitle.split(' — ');
  const projectName = pageTitleParts.length > 1 ? pageTitleParts[pageTitleParts.length - 1] : '';
  
  const link = togglbutton.createTimerLink({
    className: 'sentry',
    description: pageTitle,
    projectName: projectName
  });

  const tabListElement = elem.querySelector('ul[role="tablist"]');
  if (tabListElement) {
    tabListElement.appendChild(link);
  }
});

