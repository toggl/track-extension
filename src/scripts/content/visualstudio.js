/*
 * 2018-09
 * Warning, Visual Studio Team Services changed layout slightly (at least in HTML structure)
 * Some additional mumbo jumbo for detection is required
 * See more below
*/
'use strict';

// We need to find proper project element, which differs between old and new layout
function projectSelector () {
  const oldLayoutProjectElement = $('.tfs-selector span');
  const newLayoutProjectElement = $('.fontWeightHeavy.flex-grow.commandbar-item-text');
  const projectElement = oldLayoutProjectElement || newLayoutProjectElement;

  return projectElement ? projectElement.textContent : '';
}

function descriptionSelector () {
  const formIdElem = $('.work-item-form-id span');
  const formTitleElem = $('.work-item-form-title input');

  return (formIdElem ? formIdElem.innerText : '') +
    ' ' +
    (formTitleElem ? formTitleElem.value : '');
}

togglbutton.render(
  '.witform-layout-content-container:not(.toggl)',
  { observe: true },
  function () {
    const container = $('.work-item-form-header-controls-container');

    const vsActiveClassElem = $(
      '.commandbar.header-bottom > .commandbar-item > .displayed'
    );

    const link = togglbutton.createTimerLink({
      className: 'visual-studio-online',
      description: descriptionSelector,
      projectName: projectSelector
    });

    // For new layout vs_activeClassElem is not longer required, we can skip it
    if (
      !vsActiveClassElem ||
      vsActiveClassElem.textContent === 'Work Items' ||
      vsActiveClassElem.textContent === 'Backlogs'
    ) {
      container.appendChild(link);
    }
  }
);
