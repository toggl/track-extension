/**
 * @name Notion
 * @urlAlias notion.so
 * @urlRegex *://*.notion.so/*
 * @urlAlias notion.com
 * @urlRegex *://*.notion.com/*
 */
'use strict'

function createWrapper(link) {
  const wrapper = document.createElement('div')
  wrapper.classList.add('toggl-button-notion-wrapper')
  wrapper.appendChild(link)

  return wrapper
}

// Climb from the share button to the peek panel that owns it, so the title
// lookup stays scoped to the peek and never grabs the title of the full page
// rendered behind it. The panel is the nearest ancestor that contains the
// page title (the peek body lives below the topbar inside that same panel).
function findPeekRoot(node) {
  let current = node.closest('.notion-peek-renderer')
  if (current) return current
  current = node
  while (current && current !== document.body) {
    if (
      current.querySelector(
        'h1[contenteditable], h1[aria-roledescription="page title"]',
      )
    ) {
      return current
    }
    current = current.parentElement
  }
  return null
}

// Find the direct child of the action-button row that holds the share button.
// The row is the nearest ancestor that also contains the other topbar action
// buttons; inserting the timer button before that child drops it into the row
// rather than into the share button's own (tiny) wrapper.
function getShareRowChild(shareButton) {
  let row = shareButton.parentElement
  while (
    row &&
    row !== document.body &&
    !row.querySelector(
      '.notion-topbar-more-button, .notion-topbar-comments-button',
    )
  ) {
    row = row.parentElement
  }
  if (!row || row === document.body) return null

  let child = shareButton
  while (child.parentElement && child.parentElement !== row) {
    child = child.parentElement
  }
  return child
}

// Resolve the peek topbar that owns this share button, bounded so a full-page
// share button can't match a peek open elsewhere in the document. The topbar is
// the container of the action-button group (the group holding more/comments);
// its other side holds the peek close button (`.notion-peek-close`), which only
// exists in a peek. The close lookup is scoped to that bounded topbar rather
// than searching broad ancestors' whole subtrees.
function getPeekTopbar(shareButton) {
  let group = shareButton.parentElement
  while (
    group &&
    group !== document.body &&
    !group.querySelector(
      '.notion-topbar-more-button, .notion-topbar-comments-button',
    )
  ) {
    group = group.parentElement
  }
  if (!group || group === document.body) return null

  const topbar = group.parentElement
  return topbar && topbar.querySelector('.notion-peek-close') ? topbar : null
}

// Button renders in popup/dialog (side-peek) view. Notion keeps reshuffling the
// peek shell class (legacy `.notion-peek-renderer`, then `.peek-top-hover-area`,
// now neither wraps the share button), so anchor on the share menu directly and
// gate to peeks via the close button instead of chasing the shell class.
togglbutton.render(
  '.notion-topbar-share-menu:not(.toggl)',
  { observe: true },
  function (elem) {
    if (!elem) return

    const topbar = getPeekTopbar(elem)
    if (!topbar) return
    if (topbar.querySelector('.toggl-button-notion-wrapper')) return

    const peekRoot = findPeekRoot(elem)

    function getDescription() {
      const descriptionElem = peekRoot
        ? peekRoot.querySelector('h1[contenteditable]') ||
          peekRoot.querySelector('h1[aria-roledescription="page title"]')
        : null
      return descriptionElem ? descriptionElem.textContent.trim() : ''
    }

    const link = togglbutton.createTimerLink({
      className: 'notion',
      description: getDescription,
      autoTrackable: true,
    })

    const wrapper = createWrapper(link)

    const shareRowChild = getShareRowChild(elem)
    if (shareRowChild) {
      shareRowChild.parentElement.insertBefore(wrapper, shareRowChild)
    } else {
      elem.parentElement.prepend(wrapper)
    }
  },
)

togglbutton.inject(
  {
    node: 'main.notion-frame .notion-scroller:not(.toggl)',
    renderer: function (elem) {
      const elements = document.querySelectorAll(
        '.notion-topbar-action-buttons .toggl-button-notion-wrapper',
      )

      if (elements.length > 0) {
        elements.forEach((element) => element.remove())
      }

      function getDescription() {
        const controls = document.querySelector('.notion-page-controls')
        const topBar = document.querySelector('.notion-topbar')
        let title = ''

        if (controls) {
          if (controls.nextElementSibling) {
            title = controls.nextElementSibling
          } else {
            const parent = controls.parentElement
            title = parent ? parent.nextElementSibling : ''
          }
        }
        if (!title && topBar) {
          const breadcrumbs = topBar.querySelector('div > .notranslate')
          if (breadcrumbs) {
            title = breadcrumbs.childNodes[
              breadcrumbs.childNodes.length - 1
            ].querySelector('.notranslate:last-child')
          }
        }

        return title ? title.textContent.trim() : ''
      }

      const link = togglbutton.createTimerLink({
        className: 'notion',
        description: getDescription,
      })

      const wrapper = createWrapper(link)

      document.querySelector('.notion-topbar-action-buttons').prepend(wrapper)
    },
  },
  { observe: true },
)

/**
 * @name Notion Calendar
 * @urlAlias calendar.notion.so
 * @urlRegex *://calendar.notion.so/*
 */
togglbutton.render(
  'div[data-context-panel-root]:not(.toggl)',
  { observe: true },
  function (elem) {
    if (!elem) return
    function getDescription() {
      const descriptionElem = elem.querySelector('div[contenteditable="true"]')
      return descriptionElem ? descriptionElem.textContent.trim() : ''
    }
    if (!window.location.hostname.includes('calendar.notion.so')) return
    const link = togglbutton.createTimerLink({
      className: 'notion-calendar',
      description: getDescription,
    })

    elem.firstChild.prepend(link)
  },
)
