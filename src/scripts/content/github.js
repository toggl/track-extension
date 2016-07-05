/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('#partial-discussion-header:not(.toggl)', {observe: true}, function (elem) {
  var link, description,
    numElem = $('.gh-header-number', elem),
    titleElem = $('.js-issue-title', elem),
    projectElem = $('h1.public strong a');

  description = titleElem.innerText;
  if (numElem !== null) {
    description = numElem.innerText + " " + description;
  }

  link = togglbutton.createTimerLink({
    className: 'github',
    description: description,
    projectName: projectElem && projectElem.textContent
  });

  $('.flex-table-item-primary').appendChild(link);
});
