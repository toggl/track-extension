/*jslint indent: 2, unparam: true*/
/*global $: false, document: false, togglbutton: false*/

'use strict';

togglbutton.render('.sticky.bar .flush-left:not(.toggl)', {observe: true}, function (elem) {
  var link, description,
    numElem = $("h2 a", elem),
    titleElem = $(".tixTitle h3"),
  description = titleElem.textContent;
  description = description.trim();
  if (numElem)
  {
      description = numElem.textContent.trim() + " " + description;
  }
  link = togglbutton.createTimerLink({
    className: 'osticket',
    description: description,
    projectName: window.location.hostname
  });
  $("h2",elem).appendChild(link);
});
