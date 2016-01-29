/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('.general-header-right:not(.toggl)', {}, function (elem) {
  var link,
    description = $('Description', elem),
    project = $('Projects name', elem);


  link = togglbutton.createTimerLink({
    className: 'udemy',
    description: description,
    projectName: project
  });

  //skill-tree-header
  //var htmlElement = document.querySelector("h1");
  $('.general-header-right').appendChild(link);

});
