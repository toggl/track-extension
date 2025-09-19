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
  return document.querySelector('#card-back-name')?.textContent.trim()
}

togglbutton.inject(
  {
    node: '[data-testid="card-back-add-to-card-button"]:not(.toggl)',
    renderer: (element) => {
      if (element.parentNode.querySelector('.toggl-button.trello')) {
        return
      }

      const container = createTag('div', element.classList.toString())

      const link = togglbutton.createTimerLink({
        className: 'trello',
        description: getCardName,
        projectName: getProject,
        container: '[data-testid="card-back-name"]',
        autoTrackable: true,
      })

      // Pass through click on Trello button to the timer link
      container.addEventListener('click', (e) => {
        link.click()
      })

      container.appendChild(link)

      element.parentNode.prepend(container, element)
    },
  },
  { observe: true },
)

/* Checklist buttons */

togglbutton.injectMany(
  {
    node: '[data-testid="check-item-hover-buttons"]:not(.toggl)',
    renderer: (elements) => {
      // Loop through all the checklist items.
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

        const getDescription = () => {
          return `${getCardName()} - ${getTaskText()}`
        }

        const link = togglbutton.createTimerLink({
          className: 'trello-list',
          buttonType: 'minimal',
          projectName: getProject,
          description: getDescription,
          container: '[data-testid="card-back-name"]',
        })

        const wrapper = document.createElement('span')
        wrapper.classList.add('checklist-item-menu')
        wrapper.style.display = 'flex'
        wrapper.style.alignItems = 'center'
        wrapper.style.marginLeft = '4px'
        wrapper.appendChild(link)

        // Add StopPropagation to prevent the card from closing.
        wrapper.addEventListener('click', (e) => {
          e.preventDefault()
          e.stopPropagation()

          // Click on the Toggl button
          link.querySelector('button').click()
        })

        element.appendChild(wrapper)
      }
    },
  },
  { observe: true },
)
