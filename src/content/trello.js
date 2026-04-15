/**
 * @name Trello
 * @urlAlias trello.com
 * @urlRegex *://trello.com/*
 */
'use strict'
/* global createTag */

const getProject = () => {
  const project = document.querySelector('[data-testid="board-name-display"]')
  return project ? project.textContent.trim() : ''
}

const getCardName = () => {
  return (
    document.querySelector('[data-testid="card-back-title-input"]')?.value?.trim() ?? ''
  )
}

// preventDefault on pointerdown blocks Trello's card-dialog from closing
// (by suppressing the compat mousedown event its outside-click detector uses),
// but it also blocks native focus on form fields — so we manually re-focus
// the click target. Same pattern as the Google Calendar integration.
// We intentionally do NOT call stopPropagation: that would prevent the event
// from reaching React handlers inside #homeRoot (e.g. the description input's
// own focus/click logic), which is what made the field unresponsive before.
function initializeObserver() {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType !== Node.ELEMENT_NODE) continue
        const homeRoot = node.querySelector('#homeRoot')
        if (homeRoot) {
          // Exempt the Toggl popup from Trello's Atlaskit focus trap —
          // without this, focusing any input inside gets yanked back to
          // the card title textarea by react-focus-lock.
          homeRoot.setAttribute('data-no-focus-lock', 'true')
          homeRoot.addEventListener(
            'pointerdown',
            (e) => {
              e.preventDefault()
              if (e.target && e.target.focus) {
                e.target.focus()
              }
            },
            true,
          )
        }
      }
    }
  })

  observer.observe(document.body, { childList: true, subtree: true })
}

initializeObserver()

/* Card back timer button */

togglbutton.inject(
  {
    node: '[data-testid="card-back-title-input"]:not(.toggl)',
    renderer: (elem) => {
      const existing = document.querySelector('.trello-tb-wrapper')
      if (existing) existing.remove()

      const dialog = elem.closest('[data-testid="card-back-name"]')
      const listNameContainer = dialog?.querySelector(
        'header > div > div:first-child',
      )
      if (!listNameContainer) return

      // Lay out the list-name container as a centered flex row so our
      // button aligns vertically with the 'Today' dropdown instead of
      // floating above it on the line baseline. Trello's own CSS can
      // override plain inline styles, so use !important.
      listNameContainer.style.setProperty('display', 'inline-flex', 'important')
      listNameContainer.style.setProperty('flex-direction', 'row', 'important')
      listNameContainer.style.setProperty('align-items', 'center', 'important')

      const link = togglbutton.createTimerLink({
        className: 'trello',
        description: getCardName,
        projectName: getProject,
        autoTrackable: true,
      })

      const wrapper = createTag('div', 'trello-tb-wrapper')
      wrapper.addEventListener(
        'pointerdown',
        (e) => {
          e.stopPropagation()
        },
        true,
      )
      wrapper.appendChild(link)
      listNameContainer.appendChild(wrapper)
    },
  },
  { observe: true },
)

/* Checklist buttons */

togglbutton.injectMany(
  {
    node: '[data-testid="check-item-hover-buttons"]:not(.toggl)',
    renderer: (elements) => {
      for (const element of elements) {
        if (element.querySelector('.checklist-item-menu .toggl-button')) {
          continue
        }

        const getTaskText = () => {
          return (
            element.parentNode
              .querySelector('.ak-renderer-wrapper')
              ?.textContent.trim() ?? ''
          )
        }

        const link = togglbutton.createTimerLink({
          className: 'trello-list',
          buttonType: 'minimal',
          projectName: getProject,
          description: () => `${getCardName()} - ${getTaskText()}`,
        })

        const wrapper = document.createElement('span')
        wrapper.classList.add('checklist-item-menu')
        wrapper.style.display = 'flex'
        wrapper.style.alignItems = 'center'
        wrapper.style.marginLeft = '4px'
        wrapper.appendChild(link)

        wrapper.addEventListener('click', (e) => {
          e.preventDefault()
          e.stopPropagation()
          link.querySelector('button').click()
        })

        element.appendChild(wrapper)
      }
    },
  },
  { observe: true },
)
