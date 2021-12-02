'use strict';

// Right side panel
togglbutton.render(
  '.js-right-pane .tb-element-big:not(.toggl)',
  { observe: true },
  function (elem) {
    const container = $('.tb-element-title', elem);
    const projectElem = $('.tb-element-subtitle a', elem);
    const titleElem = $('.js-element-title-inner a', container);

    const link = togglbutton.createTimerLink({
      className: 'redbooth',
      description: titleElem.textContent,
      projectName: projectElem && projectElem.textContent
    });

    container.appendChild(link);
  }
);

// Modal window
togglbutton.render(
  '.js-modal-dialog-content:not(.toggl)',
  { observe: true },
  function (elem) {
    const container = $('.tb-element-title', elem);
    const projectElem = $('.tb-element-subtitle a', elem);
    const titleElem = $('.js-element-title-inner a', container);

    const link = togglbutton.createTimerLink({
      className: 'redbooth',
      description: titleElem.textContent,
      projectName: projectElem && projectElem.textContent
    });

    container.appendChild(link);
  }
);
