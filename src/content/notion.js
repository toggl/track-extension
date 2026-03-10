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

// Button renders in popup/dialog (side-peek) view.
// Target the share menu inside the peek renderer so that when React
// re-renders and recreates the share button, the observer re-triggers.
togglbutton.render(
  '.notion-peek-renderer .notion-topbar-share-menu:not(.toggl)',
  { observe: true },
  function (elem) {
    if (!elem) return

    const peekRenderer = elem.closest('.notion-peek-renderer')

    function getDescription() {
      const descriptionElem = peekRenderer
        ? peekRenderer.querySelector('h1[contenteditable]') ||
          peekRenderer.querySelector(
            'h1[aria-roledescription="page title"]',
          )
        : null
      return descriptionElem ? descriptionElem.textContent.trim() : ''
    }

    const link = togglbutton.createTimerLink({
      className: 'notion',
      description: getDescription,
      autoTrackable: true,
    })

    const wrapper = createWrapper(link)

    elem.parentElement.prepend(wrapper)
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
