'use strict';

// List items
togglbutton.render('.list li:not(.toggl)', { observe: true }, function (elem) {
  const taskElement = $('.task-title', elem);
  const description = $('a', taskElement).textContent.trim();

  const projectName = function () {
    const label = $('span.highlight', taskElement);
    if (label) {
      return label.textContent;
    }
    return '';
  };

  const link = togglbutton.createTimerLink({
    className: 'capsule',
    description: description,
    projectName: projectName,
    buttonType: 'minimal'
  });

  taskElement.appendChild(link);
});

// List items in new UI
togglbutton.render(
  '.general-task-item:not(.toggl)',
  { observe: true },
  function (elem) {
    const taskElement = $('.general-task-item-title', elem);

    const description = function () {
      const desc = $('.general-task-item-title-text', elem);
      if (desc) {
        return desc.textContent.trim();
      }
      return '';
    };

    const projectName = function () {
      const label = $('.general-task-item-category', elem);
      if (label) {
        return label.textContent;
      }
      return '';
    };

    const link = togglbutton.createTimerLink({
      className: 'capsule',
      description: description,
      projectName: projectName,
      buttonType: 'minimal'
    });

    taskElement.appendChild(link);
  }
);
