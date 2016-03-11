/*jslint indent: 2, unparam: true*/
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('#docs-bars:not(.toggl)', {}, function (elem) {
  var link, titleFunc;

  titleFunc = function () {
    return document.querySelector(".docs-title-input").value;
  };

  link = togglbutton.createTimerLink({
    className: 'google-docs',
    description: titleFunc
  });
  $('#docs-menubar').appendChild(link);
});
