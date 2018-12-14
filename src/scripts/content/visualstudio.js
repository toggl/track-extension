/*
 * 2018-09
 * Warning, Visual Studio Team Services changed layout slightly (at least in HTML structure)
 * Some additional mumbo jumbo for detection is required
 * See more below
*/
'use strict';

// We need to find proper project element, which differs between old and new layout
function projectSelector () {
  var oldLayoutProjectElement = $('.tfs-selector span');
  var newLayoutProjectElement = $('.fontWeightHeavy.flex-grow.commandbar-item-text');
  var projectElement = oldLayoutProjectElement || newLayoutProjectElement;

  return projectElement ? projectElement.textContent : ''
}

function descriptionSelector () {
  var formIdElem = $('.work-item-form-id span');
  var formTitleElem = $('.work-item-form-title input');

  return (formIdElem ? formIdElem.innerText : '') +
    ' ' +
    (formTitleElem ? formTitleElem.value : '');
}

togglbutton.render(
  '.witform-layout-content-container:not(.toggl)',
  { observe: true },
  function() {
    var link,
      container = $('.work-item-form-header-controls-container'),
      vs_activeClassElem = $(
        '.commandbar.header-bottom > .commandbar-item > .displayed'
      );

    link = togglbutton.createTimerLink({
      className: 'visual-studio-online',
      description: descriptionSelector,
      projectName: projectSelector
    });

    // For new layout vs_activeClassElem is not longer required, we can skip it
    if (
      !vs_activeClassElem ||
      vs_activeClassElem.textContent === 'Work Items' ||
      vs_activeClassElem.textContent === 'Backlogs'
    ) {
      container.appendChild(link);
    }
  }
);
