/*jslint indent: 2, unparam: true*/
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('#tickets-show:not(.toggl)', {observe: true}, function (elem) {

  var link,
    description = $('span.ticket-number', elem).textContent + ' ' + $('.ticket-summary > h1').textContent,
    project = $('h1.header-w > span').textContent;

  link = togglbutton.createTimerLink({
    className: 'assembla',
    description: description,
    projectName: project,
  });

  var linkParent = $('.sidebar > .m-10', elem);
  linkParent.insertBefore(link, $('.ticket-info', linkParent));
});
