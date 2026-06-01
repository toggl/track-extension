/**
 * @name Notion
 * @urlAlias notion.so
 * @urlRegex *://*.notion.so/*
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

// Button renders in popup/dialog (side-peek) view.
// Target the share menu inside the peek topbar so that when React re-renders
// and recreates the share button, the observer re-triggers. Notion's peek
// topbar markup changes often; match both the legacy `.notion-peek-renderer`
// shell and the newer `.peek-top-hover-area` one.
togglbutton.render(
  '.notion-peek-renderer .notion-topbar-share-menu:not(.toggl), .peek-top-hover-area .notion-topbar-share-menu:not(.toggl)',
  { observe: true },
  function (elem) {
    if (!elem) return

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
