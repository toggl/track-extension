/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('#js-discussion-header', {}, function (elem) {
  var link, description,
    numElem = $('.issue-number', elem),
    titleElem = $('.js-issue-title', elem),
    projectElem = $('.js-current-repository');

  description = titleElem.innerText;
  if (numElem !== null) {
    description = numElem.innerText + " " + description;
  }

  link = togglbutton.createTimerLink({
    className: 'github',
    description: description,
    projectName: projectElem && projectElem.textContent
  });

  $('.gh-header-meta').appendChild(link);
});
