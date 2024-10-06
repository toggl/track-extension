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

// Selectors here are madness, it works for as of Dec 4th 2019
// Button renders in popup/dialog view
togglbutton.render(
  '.notion-peek-renderer:not(.toggl)',
  { observe: true },
  function (elem) {
    if (!elem) return
    function getDescription() {
      const descriptionElem = elem.querySelector(
        '.notion-peek-renderer .notion-scroller h1[contenteditable]',
      )
      return descriptionElem ? descriptionElem.textContent.trim() : ''
    }

    const link = togglbutton.createTimerLink({
      className: 'notion',
      description: getDescription,
      autoTrackable: true,
    })

    const wrapper = createWrapper(link)

    const root = elem.querySelector('.notion-topbar-share-menu')
    if (root) {
      root.parentElement.prepend(wrapper)
    } else {
      const selector = elem.querySelector(
        'div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3)',
      )
      if (!selector) return
      selector.prepend(wrapper)
    }
  },
)

togglbutton.inject(
  {
    node: '.notion-topbar-action-buttons',
    renderer: function (elem) {
      const elements = document.querySelectorAll(
        '.notion-topbar-action-buttons .toggl-button-notion-wrapper',
      )

      if (elements.length > 0) {
        elements.forEach((element) => element.remove())
      }

      elem.style.position = 'relative'

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

      elem.prepend(wrapper)
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
