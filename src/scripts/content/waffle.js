/*jslint indent: 2, unparam: true*/
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('.comments-number:not(.toggl)',  {observe: true}, function (elem) {

  var link, description;

  description = '#' + $('.issue-number').textContent + ' ' + $('.issue-title').textContent;

  link = togglbutton.createTimerLink({
    className: 'waffle-io',
    description: description
  });


  elem.appendChild(link);
});
