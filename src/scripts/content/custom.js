'use strict';

togglbutton.render(
  'span.toggl-custom-button[data-description]:not(.toggl)',
  { observe: true },
  function (elem) {
    if (process.env.DEBUG) {
      console.info('🏃 "custom" rendering');
    }
    const description = elem.dataset.description.trim();
    const projectName = (elem.dataset['project-name'] || '').trim();

    const link = togglbutton.createTimerLink({
      className: 'custom',
      description: description,
      projectName: projectName
    });

    elem.appendChild(link);
  });
