/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/

"use strict";

togglbutton.render('form.story:not(.toggl)', {observe: true}, function (elem) {
  var link,
    titleElem = $('textarea', elem),
    id = $('.id.text_value', elem),
    container = $('.edit aside', elem),
    projectName = $('title').textContent;

  if (titleElem === null || container === null) {
    return;
  }

  link = togglbutton.createTimerLink({
    className: 'pivotal',
    description: id.value + ' ' + titleElem.value,
    projectName: projectName && projectName.split(' -').shift()
  });

  container.appendChild(link);
});
