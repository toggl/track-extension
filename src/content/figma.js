/**
 * @name Figma
 * @urlAlias figma.com
 * @urlRegex *://*.figma.com/*
 */
'use strict';

togglbutton.render(
  'div[aria-label="Main toolbar"]:not(.toggl)',
  { observe: true },
  function (elem) {
    const titleElem = $('span[aria-label="File name"]', elem).parentElement
    const titles = []
    for (let children of titleElem.children){
      if(children.textContent.trim() !== '') titles.push(children.textContent.trim())
      // Test after file name is useless
      if(children.ariaLabel === 'File name') break
    }
    const text = titles.join(' / ')

    const container = elem.lastChild;

    const link = togglbutton.createTimerLink({
      className: 'figma',
      description: text,
      buttonType: 'minimal'
    });

    if($('div[aria-label="Main toolbar"] .toggl-button.figma')){
      $('div[aria-label="Main toolbar"] .toggl-button.figma').remove()
    }
    container.prepend(link);
  }
);
