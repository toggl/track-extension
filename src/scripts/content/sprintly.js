/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('.modal-content .card_container:not(.toggl)', {observe: true}, function (elem) {
  var link, description;

  description = $(".card_container .body a.title", elem).textContent.trim();

  link = togglbutton.createTimerLink({
    className: 'sprintly',
    description: description
  });

  $(".card_container .card .top", elem).appendChild(link);
});
