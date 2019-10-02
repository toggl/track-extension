'use strict';

togglbutton.render(
  '.hub-title .left-group:not(.toggl)',
  { observe: true },
  $container => {
    const descriptionSelector = () => {
      const e = $('input.vc-title-text');
      return (e && e.value);
    };

    const projectSelector = () => {
      return undefined;
    };

    const tagsSelector = () => {
      return [];
    };

    const link = togglbutton.createTimerLink({
      className: 'teamfoundationserver',
      description: descriptionSelector,
      projectName: projectSelector,
      tags: tagsSelector
    });

    $('.hub-title .left-group').appendChild(link);
  }
);
