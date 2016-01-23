/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('.share-buttons:not(.toggl)', {}, function (elem) {
  var link,
    description = $('Description', elem),
    project = $('Projects name', elem);


  link = togglbutton.createTimerLink({
    className: 'pc-help',
    description: description,
    projectName: project
  });

  $('.share-buttons').appendChild(link);


});
