'use strict';

togglbutton.render(
  '#viewTask-infoSummary:not(.toggl)',
  { observe: true },
  function(elem) {
    var link,
      projectNr = elem.querySelector('dd').textContent,
      project = $('#viewTask-projectName', elem).textContent,
      title = $('h2', elem).textContent,
      description = projectNr + ' - ' + project + ' : ' + title;

    link = togglbutton.createTimerLink({
      className: 'proworkflow',
      description: description,
      projectName: projectNr + ' - ' + project
    });

    elem.appendChild(link);
  }
);
