/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

/* the first selector is required for youtrack-5 and the second for youtrack-6 */
togglbutton.render('.fsi-toolbar-content:not(.toggl), .toolbar_fsi:not(.toggl)', {observe: true}, function (elem) {
  var link, description,
    numElem = $('a.issueId'),
    titleElem = $(".issue-summary"),
    projectElem = $('.fsi-properties a[title^="Project"], .fsi-properties .disabled.bold');

  description = titleElem.textContent;
  description = numElem.firstChild.textContent.trim() + " " + description.trim();

  link = togglbutton.createTimerLink({
    className: 'youtrack',
    description: description,
    projectName: projectElem ? projectElem.textContent : ''
  });

  elem.insertBefore(link, titleElem);
});

// Agile board
togglbutton.render('.yt-agile-card:not(.toggl)', {observe: true}, function (elem) {
  var link,
    container = $('.yt-agile-card__header', elem),
    description = $('.yt-agile-card__summary', elem).textContent,
    projectName = $('.yt-issue-id').textContent.split('-');

  if (projectName.length > 1) {
    projectName.pop();
  }

  link = togglbutton.createTimerLink({
    className: 'youtrack',
    buttonType: 'minimal',
    description: description ? description.trim() : '',
    projectName: projectName.join('')
  });

  container.appendChild(link);
});
