/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/

'use strict';

togglbutton.render('.ticket-fields-panel:not(.toggl)', {observe: true}, function (elem) {
  var link, description,
    titleElem = $("h1.summary .number", elem),
    numElem   = $("h1.summary .text-field-text", elem),
    projectName = $('#account_header .nav:not(.right-actions-top) .dropdown-toggle').textContent;

  description = titleElem.innerText + ": " + numElem.innerText;

  link = togglbutton.createTimerLink({
    className: 'unfuddle',
    description: description,
    projectName: projectName
  });

  $(".primary-properties", elem).appendChild(link);
});
