'use strict';

togglbutton.render(
  '#conversationHeader:not(.toggl)',
  { observe: true },
  function() {
    var link,
      len,
      description,
      spans = document
        .getElementsByTagName('h1')[0]
        .getElementsByTagName('span'),
      project = $('li.active'),
      container = $('#conversationHeader h1');

    len = spans.length;

    if (len > 1) {
      description = $('h1 span:nth-child(2)');
    } else {
      description = $('h1 span');
    }

    link = togglbutton.createTimerLink({
      className: 'protonmail',
      description: description.textContent,
      projectName: project.textContent.trim()
    });

    container.appendChild(link);
  }
);
