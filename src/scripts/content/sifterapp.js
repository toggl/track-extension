/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('.subheader-status .subheader-content', {}, function (elem) {
  var link, description,
    numElem = $('.subheader-content h2 i'),
    titleElem = $('.subheader-content h2'),
    projectElem = $('#header h1');

  description = titleElem.innerText;
  if (numElem !== null) {
    description = numElem.innerText + " " + description;
  }

  link = togglbutton.createTimerLink({
    className: 'sifterapp',
    description: description,
    projectName: projectElem && projectElem.textContent
  });

  $('.subheader-content').appendChild(link);
});
