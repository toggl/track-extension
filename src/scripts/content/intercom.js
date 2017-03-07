/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('span.ember-view:first-child .conversation__text:not(.toggl)', {observe: true}, function (elem) {
  var link,
    description = elem.textContent.trim();

  link = togglbutton.createTimerLink({
    className: 'intercom',
    description: description
  });

  if ($('.toggl-button.intercom') !== null) {
    $('.toggl-button.intercom').remove();
  }

  $('.tabs__discrete-tab__container').appendChild(link);
});