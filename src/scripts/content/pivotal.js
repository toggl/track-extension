/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/

"use strict";

togglbutton.render('form.story:not(.toggl)', {observe: true}, function (elem) {
  var link,
    titleElem = $('textarea', elem),
    container = $('.edit aside', elem);

  if (titleElem === null || container === null) {
    return;
  }
  link = togglbutton.createTimerLink({
    className: 'pivotal',
    description: titleElem.value
  });

  container.appendChild(link);
});
