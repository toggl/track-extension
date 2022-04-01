'use strict';
/**
 * @name Linear
 * @urlAlias linear.app
 * @urlRegex *://linear.app/*
 */

// Add linear integration in board view only
togglbutton.render(
  'a[data-rbd-draggable-id]:not(.toggl)',
  { observe: true },
  function (elem) {
    const id = elem.querySelector('div:first-child>div:first-child>div:first-child>span:first-child')?.textContent?.split('›')[0];
    const title = elem.querySelector('div:first-child>div:first-child>div:first-child>span:first-child+div')?.textContent;

    // Project selection only works if an existing Toggl project matches the name of the project from the linear card
    const project = elem.querySelector(':scope>div:first-child>div:nth-child(2)>div:not(:first-child):not([role="button"])>span:only-child>div:only-child[role="button"]>div+span[type="micro"]')?.textContent;

    // Gets the labels on the card as a string array.
    const labels = [...elem.querySelectorAll(':scope>div:first-child>div:nth-child(2)>div:not([role="button"])>div[role="button"]')].map((n)=>n.textContent)

    const link = togglbutton.createTimerLink({
      description: title,
      buttonType: 'minimal', // button type, if skipped will render full size
      projectName: project,
      // For some reason, tag selection isn't working even if the like-named tags have already been created in Toggl
      tags: [id, ...labels],
    });
    link.style.right = '13px';
    link.style.position = 'fixed';
    elem.appendChild(link);
  }
);

