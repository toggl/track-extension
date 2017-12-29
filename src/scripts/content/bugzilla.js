/*jslint indent: 2, unparam: true*/
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('input[name=id]', {}, function (elem) {
  var link,
    description = elem.value,
    targetElement;

  link = togglbutton.createTimerLink({
    className: 'bugzilla',
    description: description,
    projectName: 'Bugs'
  });

  targetElement = $('#summary_alias_container') || $('#summary_container');

  if (targetElement !== null) {
    targetElement.appendChild(link);
  }
});
