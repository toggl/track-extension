/*jslint indent: 2, unparam: true*/
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('.modal-header .content:not(.toggl)',  {observe: true}, function (elem) {

  var link, description;

  description = $('.modal-header .info .number').textContent + ' ' + $('.modal-header .content .title').textContent;

  link = togglbutton.createTimerLink({
    className: 'overv-io',
    description: description
  });


  elem.appendChild(link);
});
