'use strict';

togglbutton.render(
  '#filter-navigator-container:not(.toggl)',
  { observe: true },
  function() {
    var link,
      description,
      numElem = $('.item-title'),
      titleElem = $('.item-title'),
      projectElem = $('.project-info a');

    description = titleElem.textContent;
    if (numElem !== null) {
      description = numElem.textContent + ' ' + description;
    }

    link = togglbutton.createTimerLink({
      className: 'gemini',
      description: description,
      projectName: projectElem.textContent
    });

    $('#filter-navigator-container').parentNode.insertBefore(
      link,
      $('#filter-navigator-container')
    );
  }
);
