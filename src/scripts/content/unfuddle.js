/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/

'use strict';

togglbutton.render('.ticket-fields-panel:not(.toggl)', {observe: true}, function (elem) {
  var link, description,
    titleElem = $("h1.summary .number", elem),
    numElem   = $("h1.summary .text-field-text", elem);

  description = titleElem.innerText + ": " + numElem.innerText;

  link = togglbutton.createTimerLink({
    className: 'unfuddle',
    description: description
  });

  $(".primary-properties", elem).appendChild(link);
});
