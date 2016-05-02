/*jslint indent: 2, unparam: true*/
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('.task-list-item', {}, function (elem) {
  var link, description = elem.textContent;

  link = togglbutton.createTimerLink({
    className: 'esa',
    description: description
  });

  elem.appendChild(link);
});
