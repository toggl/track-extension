/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/

togglbutton.render('.issueContainer .fsi-toolbar-content:not(.toggl)', {observe: true}, function (elem) {
  'use strict';

  var link, description,
    numElem = $('a.issueId'),
    titleElem = $(".issue-summary"),
    projectElem = $('.fsi-properties a[title^="Project"]');

  description = titleElem.textContent;
  description = numElem.firstChild.textContent.trim() + " " + description.trim();

  link = togglbutton.createTimerLink({
    className: 'youtrack',
    description: description,
    projectName: projectElem ? projectElem.textContent : ''
  });

  elem.insertBefore(link, elem.firstChild);
});
