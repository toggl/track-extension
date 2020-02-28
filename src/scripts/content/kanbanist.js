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

    const linkStyle = 'margin-left: 5px;visibility: hidden';
    const link = togglbutton.createTimerLink({
      className: 'kanbanist',
      description: descriptionSelector,
      projectName: projectSelector,
      buttonType: 'minimal'
    });
    link.classList.add('task-link');
    link.setAttribute('style', linkStyle);
    console.error($container);
    $('.ListItem-text', $container).after(link);
    $container.onmouseenter = () => {
      console.log(link.style.visibility);
      link.style.visibility = 'visible';
    };
    $container.onmouseleave = () => {
      console.log(link.style.visibility);
      link.style.visibility = 'hidden';
    };
  }
);
