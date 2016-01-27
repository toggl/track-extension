/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('.skill-tree-header:not(.toggl)', {}, function (elem) {
  var link,
    description = $('Description', elem),
    project = $('Projects name', elem);


  link = togglbutton.createTimerLink({
    className: 'duolingo',
    description: description,
    projectName: project
  });

  //skill-tree-header
  //var htmlElement = document.querySelector("h1");
  $('.skill-tree-header').appendChild(link);

});
