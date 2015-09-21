/*jslint indent: 2, unparam: true*/
/*global $: false, document: false, togglbutton: false, createTag: false*/
'use strict';

togglbutton.render('#tickets-show:not(.toggl)', {}, function (elem) {

  var link,
    container = createTag('li', 'toggle-container'),
    description = $('span.ticket-number', elem).textContent + ' ' + $('.ticket-summary > h1').textContent,
    project = $('h1.header-w > span').textContent;

  link = togglbutton.createTimerLink({
    className: 'assembla',
    description: description,
    projectName: project,
  });

  container.appendChild(link);
  $('ul.menu-submenu').appendChild(container);
});
