/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('.b-eb-Uk-Vj:not(.toggl)', {observe: true}, function (elem) {
  var link,
    project = function () {
      var p = $('.zl-Uk-hl .zl-Uk-xf .zl-Uk-Tl');
      if (!p) {
        return;
      }

      return $('.zl-Uk-hl .zl-Uk-xf .zl-Uk-Tl').innerText;
    },
    description = $('.b-eb-Uk-Tl', elem).textContent.trim();

  link = togglbutton.createTimerLink({
    className: 'rememberthemilk',
    description: description,
    projectName: project,
    buttonType: 'minimal'
  });

  elem.appendChild(link);
});
