'use strict';

togglbutton.render(
  '.notion-overlay-container .notion-peek-renderer .notion-page-controls + .notion-selectable > [contenteditable="true"][placeholder="Untitled"]:not(.toggl)',
  { observe: true },
  function (elem) {
    const container = createTag('div', 'button-link notion-tb-wrapper');
    const descriptionElem = elem;
    const projectElem = $(
      '.notion-sidebar-container > * > * > * > * > * > * > * > * + * > * > *'
    );
    const togglButtonLoc = $(
      '.notion-overlay-container .notion-peek-renderer [rel="noopener noreferrer nofollow"] + [style*="flex-grow: 1"] + *'
    );

    const link = togglbutton.createTimerLink({
      className: 'notion',
      description: descriptionElem.textContent.trim(),
      projectName: projectElem && projectElem.textContent,
      calculateTotal: true,
      buttonType: 'minimal'
    });

    container.appendChild(link);
    togglButtonLoc.parentNode.insertBefore(container, togglButtonLoc);
  }
);
