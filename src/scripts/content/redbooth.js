/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/

'use strict';

// Right side panel
togglbutton.render('.js-right-pane .tb-element-big:not(.toggl)', {observe: true}, function (elem) {
  var link,
    container = $('.tb-element-title', elem),
    projectElem = $('.tb-element-subtitle a', elem),
    titleElem = $('.js-element-title-inner a', container);

  link = togglbutton.createTimerLink({
    className: 'redbooth',
    description: titleElem.textContent,
    projectName: projectElem && projectElem.textContent
  });

  container.appendChild(link);
});


// Modal window
togglbutton.render('.js-modal-dialog-content:not(.toggl)', {observe: true}, function (elem) {
  var link,
    container = $('.tb-element-title', elem),
    projectElem = $('.tb-element-subtitle a', elem),
    titleElem = $('.js-element-title-inner a', container);

  link = togglbutton.createTimerLink({
    className: 'redbooth',
    description: titleElem.textContent,
    projectName: projectElem && projectElem.textContent
  });

  container.appendChild(link);
});