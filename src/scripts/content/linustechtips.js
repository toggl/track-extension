/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('.ipsType_pageTitle:not(.toggl)', {}, function (elem) {
  var link,
    description = $('h1').textContent;


  link = togglbutton.createTimerLink({
    className: 'linustechtips',
    description: description
  });

  $('.ipsType_pageTitle').appendChild(link);



});
