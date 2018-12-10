'use strict';

togglbutton.render(
  '.notion-peek-renderer:not(.toggl)',
  { observe: true },
  function(elem) {
    var link,
      container = createTag('div', 'button-link notion-tb-wrapper'),
      descriptionElem = $(
        '.notion-overlay-container .notion-peek-renderer .notion-page-controls + .notion-selectable > [contenteditable="true"][placeholder="Untitled"]:not(.toggl)'
      ),
      projectElem = $(
        '.notion-sidebar-container > * > * > * > * > * > * > * > * + * > * > *'
      ),
      togglButtonLoc = $(
        '.notion-overlay-container .notion-peek-renderer [rel="noopener noreferrer nofollow"] + [style*="flex-grow: 1"] + *'
      );

    link = togglbutton.createTimerLink({
      className: 'notion',
      description: descriptionElem.textContent.trim(),
      projectName: projectElem && projectElem.textContent,
      calculateTotal: true,
      buttonType: 'minimal'
    });

    link.style.cursor = 'pointer';

    container.appendChild(link);
    togglButtonLoc.parentNode.insertBefore(container, togglButtonLoc);
  }
);
