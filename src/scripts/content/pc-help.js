/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('.share-buttons:not(.toggl)', {}, function (elem) {
  var link,
    description = $('.first').innerText;


  link = togglbutton.createTimerLink({
    className: 'pc-help',
    description: description,
    projectName: 'PC-HELP.cz - České diskuzní fórum'
  });

  $('.share-buttons').appendChild(link);


});
