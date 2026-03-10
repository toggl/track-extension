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

// Intercept pointerdown events on the Toggl edit form to prevent
// Trello's card dialog from closing (same approach as Google Calendar).
function initializeObserver() {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType !== Node.ELEMENT_NODE) continue
        const homeRoot = node.querySelector('#homeRoot')
        if (homeRoot) {
          homeRoot.addEventListener(
            'pointerdown',
            (e) => {
              e.preventDefault()
              e.stopPropagation()
              if (e.target.focus) e.target.focus()
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

      const link = togglbutton.createTimerLink({
        className: 'trello',
        description: getCardName,
        projectName: getProject,
        autoTrackable: true,
      })

      const wrapper = createTag('div', 'trello-tb-wrapper')
      wrapper.addEventListener('pointerdown', (e) => {
        e.preventDefault()
        e.stopPropagation()
      }, true)
      wrapper.appendChild(link)
      elem.after(wrapper)
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
