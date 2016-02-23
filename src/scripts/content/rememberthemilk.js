/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('.b-eb-Uk-Vj:not(.toggl)', {observe: true}, function (elem) {
  var link, project,
    description = $('.b-eb-Uk-Tl', elem).textContent.trim(),
    tagElem = $('.b-eb-Uk-o', $('.b-eb-Uk-m', elem));

  if (tagElem) {
    project = tagElem.textContent.trim();
  }

  link = togglbutton.createTimerLink({
    className: 'rememberthemilk',
    description: description,
    projectName: project
  });

  elem.appendChild(link);
});
