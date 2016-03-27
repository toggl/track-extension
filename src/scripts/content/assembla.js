/*jslint indent: 2, unparam: true*/
/*global $: false, document: false, togglbutton: false, createTag: false*/
'use strict';

togglbutton.render('#ticketDetailsContainer:not(.toggl)', {observe: true}, function (elem) {

  var link,
    container = createTag('li', 'toggle-container'),
    descFunc,
    projectFunc;


  descFunc = function () {
    return document.querySelector('#copyButton1').getAttribute('data-clipboard-text');
  };

  projectFunc = function () {
    return $('h1.header-w > span').textContent || "";
  };

  link = togglbutton.createTimerLink({
    className: 'assembla',
    description: descFunc,
    projectName: projectFunc,
  });

  container.appendChild(link);
  $('ul.menu-submenu').appendChild(container);
});
