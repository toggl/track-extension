'use strict';
/* global togglbutton, $ */

togglbutton.render(
  '.ListItem:not(.toggl)',
  { observe: true },
  $container => {
    const descriptionSelector = () => {
      const $description = $('.ListItem-text', $container);
      return $description.textContent.trim();
    };

    const projectSelector = () => {
      const $project = $('.ListItem-project-name', $container);
      return $project.textContent.trim();
    };

    const linkStyle = 'margin-left: 5px';
    const link = togglbutton.createTimerLink({
      className: 'kanbanist',
      description: descriptionSelector,
      projectName: projectSelector,
      buttonType: 'minimal'
    });
    link.classList.add('task-link', 'sr-only', 'sr-only-focusable');
    link.setAttribute('style', linkStyle);
    $('.task-link', $container).after(link);
  }
);
