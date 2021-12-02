/*
 * 2018-09
 * Warning, Visual Studio Team Services changed layout slightly (at least in HTML structure)
 * Some additional mumbo jumbo for detection is required
 * See more below
*/
'use strict';

function getContainer (selector) {
  const visibleContainers = Array
    .from(document.querySelectorAll(selector))
    .filter(isElementVisible);

  return visibleContainers.length > 0 && visibleContainers[0];
}

// We need to find proper project element, which differs between old and new layout
function projectSelector () {
  const oldLayoutProjectElement = $('.tfs-selector span');
  const newLayoutProjectElement = $('.fontWeightHeavy.flex-grow.commandbar-item-text');
  const projectElement = oldLayoutProjectElement || newLayoutProjectElement;

  return projectElement ? projectElement.textContent : '';
}

function descriptionSelectorFactory (container) {
  return function () {
    const formIdElem = $('.work-item-form-id span', container);
    const formTitleElem = $('.work-item-form-title input', container);

    return (formIdElem ? formIdElem.innerText : '') +
      ' ' +
      (formTitleElem ? formTitleElem.value : '');
  };
}

function isElementVisible (element) {
  return element && element.offsetParent !== null;
}

togglbutton.render(
  '.witform-layout-content-container:not(.toggl)',
  { observe: true },
  function () {
    const activeButtonContainer = getContainer('.work-item-form-toolbar-container ul');
    const activeHeaderContainer = getContainer('.work-item-form-main-header');
    const vsActiveClassElem = $('.commandbar.header-bottom > .commandbar-item > .displayed');

    const link = togglbutton.createTimerLink({
      className: 'visual-studio-online',
      description: descriptionSelectorFactory(activeHeaderContainer),
      projectName: projectSelector,
      container: '.work-item-form-main-header'
    });

    // For new layout vs_activeClassElem is not longer required, we can skip it
    if (
      !vsActiveClassElem ||
      vsActiveClassElem.textContent === 'Work Items' ||
      vsActiveClassElem.textContent === 'Backlogs'
    ) {
      const wrapper = createTag('li', 'menu-item');
      wrapper.appendChild(link);
      activeButtonContainer.appendChild(wrapper);
    }
  }
);
