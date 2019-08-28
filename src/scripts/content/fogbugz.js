'use strict';

togglbutton.render('section.case:not(.toggl)', { observe: true }, function (
  elem
) {
  const container = createTag('div', 'control');
  const titleElem = $('.top h1', elem);
  const projectElem = $('.top .case-header-info a');
  const caseNoElem = $('.top .left a.case');
  const controlsElem = $('nav .controls');

  const link = togglbutton.createTimerLink({
    className: 'fogbugz',
    description: '[' + caseNoElem.textContent + '] ' + titleElem.textContent,
    projectName: projectElem.textContent
  });

  container.appendChild(link);
  controlsElem.appendChild(container);
});
