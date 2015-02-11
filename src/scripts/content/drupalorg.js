/*jslint indent: 2, unparam: true*/
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('body.node-type-project-issue #tabs ul:not(.toggl)', {}, function (elem) {

  var link = togglbutton.createTimerLink({
    className: 'drupalorg',
    description: elem.textContent
  });

  elem.appendChild(document.createElement('li').appendChild(link));
});