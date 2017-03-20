/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false, createTag:false*/

'use strict';

togglbutton.render('section.case:not(.toggl)', {observe: true}, function (elem) {
  var link, id, container = createTag('div', 'control'),
    titleElem = $('.top h1', elem),
    projectElem = $('.top .case-header-info a'),
    caseNoElem = $('.top .left a.case'),
    controlsElem = $('nav .controls');

  link = togglbutton.createTimerLink({
    className: 'fogbugz',
    id: "[" + caseNoElem.textContent + "]",
    description: titleElem.textContent,
    projectName: projectElem.textContent
  });

  container.appendChild(link);
  controlsElem.appendChild(container);
});