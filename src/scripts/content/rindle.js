/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('.time__tracker:not(.toggl)', { observe: true }, function (elem) {
  var delay = 1000;
  setTimeout(function () {
    var link, cardTitle = $('.toggl__card-title', elem);

    if (cardTitle === null) {
      return;
    }

    link = togglbutton.createTimerLink({
      className: 'rindle',
      description: cardTitle.innerText
    });

    $('.toggl__container', elem).appendChild(link);
  }, delay);
});
