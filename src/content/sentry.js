'use strict';

togglbutton.render('[data-test-id="group-event-details"]:not(.toggl)', { observe: true }, function (elem) {
  if (elem.querySelector('.toggl-button')) {
    return;
  }

  const pageTitle = $('title').textContent.trim();

  // Extract the project name from the page title, assuming it's the last part after ' — '
  const pageTitleParts = pageTitle.split(' — ');
  const projectName = pageTitleParts.length > 1 ? pageTitleParts[pageTitleParts.length - 1] : '';

  const link = togglbutton.createTimerLink({
    className: 'sentry',
    description: pageTitle,
    projectName: projectName
  });

  const eventInfoElement = elem.querySelector('[data-sentry-element="EventInfo"]');
  if (eventInfoElement) {
    eventInfoElement.appendChild(link);
  }
});

