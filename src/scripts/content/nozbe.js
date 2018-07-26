'use strict';

togglbutton.render(
  '.details__attributes-right:not(.toggl)',
  { observe: true },
  function(elem) {
    var div,
      link,
      description = $('.details__title-name, js--displayEditForm').textContent,
      project = $('.details__attribute-name').textContent;

    link = togglbutton.createTimerLink({
      className: 'nozbe',
      description: description,
      projectName: project
    });

    div = document.createElement('div');
    div.classList.add('details__attribute', 'togglContainer');
    div.appendChild(link);
    elem.appendChild(div);
  }
);
