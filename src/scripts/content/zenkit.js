/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false, createTag:false*/

'use strict';

togglbutton.render('.zenkit-entry-detail-popup-header:not(.toggl)', {observe: true}, function (elem) {
  var link, container = createTag('div', 'zenkit-entry-details zenkit-tb-wrapper'),
    descFunc,
    titleElem = $('.zenkit-entry-detail-popup-header-entry-name', elem),
    projectElem = $('.zenkit-navigation-bar-list-settings-text'),
    entryDetails = $('.zenkit-entry-details:first-child');

  if (!entryDetails) {
    return;
  }

  descFunc = function () {
    return titleElem.textContent;
  };

  link = togglbutton.createTimerLink({
    className: 'zenkit',
    description: descFunc,
    projectName: projectElem.textContent,
    calculateTotal: true
  });

  container.appendChild(link);
  entryDetails.parentNode.insertBefore(container, entryDetails);
}, '.zenkit-entry-detail-popup-container');

/* Checklist buttons */
// togglbutton.render('.checklist-item-details:not(.toggl)', {observe: true}, function (elem) {
//   var link,
//     projectElem = $('.board-header > a'),
//     titleElem = $('.window-title h2'),
//     taskElem = $('.checklist-item-details-text', elem);
//
//   link = togglbutton.createTimerLink({
//     className: 'zenkit',
//     buttonType: 'minimal',
//     projectName: projectElem.textContent,
//     description: titleElem.textContent + ' - ' + taskElem.textContent,
//   });
//
//   link.classList.add('checklist-item-button');
//   elem.parentNode.appendChild(link);
// }, ".checklist-items-list, .window-wrapper");
