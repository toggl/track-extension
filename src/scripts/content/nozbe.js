'use strict';

togglbutton.render(
  '.details__attributes-right:not(.toggl)',
  { observe: true },
  function (elem) {
    const description = $('.details__title-name, js--displayEditForm').textContent;
    const project = $('.details__attribute-name').textContent;

    const link = togglbutton.createTimerLink({
      className: 'nozbe',
      description: description,
      projectName: project
    });

    const div = document.createElement('div');
    div.classList.add('details__attribute', 'togglContainer');
    div.appendChild(link);
    elem.appendChild(div);
  }
);
