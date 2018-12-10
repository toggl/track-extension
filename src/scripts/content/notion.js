'use strict';

togglbutton.render(
  '.notion-peek-renderer:not(.toggl)',
  { observe: true },
  function(elem) {
    var link,
      container = createTag('div', 'button-link notion-tb-wrapper'),
      descFunc,
      descriptionElem = elem,
      projectElem = $(
        '.notion-sidebar-container > * > * > * > * > * > * > * > * + * > * > *'
      ),
      togglButtonLoc = $(
        '.notion-overlay-container .notion-peek-renderer [rel="noopener noreferrer nofollow"] + [style*="flex-grow: 1"] + *'
      );

    if (!descriptionElem || !togglButtonLoc) {
      return;
    }

    descFunc = function() {
      return descriptionElem.textContent;
    };

    link = togglbutton.createTimerLink({
      className: 'notion',
      description: descFunc,
      projectName: projectElem && projectElem.textContent,
      calculateTotal: true
    });

    link.style.cursor = 'pointer';

    container.appendChild(link);
    togglButtonLoc.parentNode.insertBefore(container, togglButtonLoc);
  }
);
