/*jslint indent: 2, unparam: true*/
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('.comments-number:not(.toggl)',  {observe: true}, function (elem) {

  var link, description, id;

  id = '#' + $('.issue-number').textContent;
  description = ' ' + $('.issue-title').textContent;

  link = togglbutton.createTimerLink({
    className: 'waffle-io',
    id: id,
    description: description
  });


  elem.appendChild(link);
});
