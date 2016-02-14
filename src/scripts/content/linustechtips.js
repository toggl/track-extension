/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('.ipsType_pageTitle:not(.toggl)', {}, function (elem) {
  var link,
    description = $('Description', elem),
    project = $('Projects name', elem);


  link = togglbutton.createTimerLink({
    className: 'linustechtips',
    description: description,
    projectName: project
  });

  $('.ipsType_pageTitle').appendChild(link);



});
