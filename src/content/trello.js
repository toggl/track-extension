/**
 * @name Trello
 * @urlAlias trello.com
 * @urlRegex *://trello.com/*
 */
'use strict'
/* global createTag */

const getProject = () => {
  const project = document.querySelector(
    '.board-header [data-testid="board-name-display"]',
  )
  return project ? project.textContent.trim() : ''
}

const cardContainerSelector = '.window-wrapper'

togglbutton.render(
  '#card-back-name:not(.toggl)',
  { observe: true, debounceInterval: 1000 },
  (elem) => {
    const actionsWrapper = $(
      '#layer-manager-card-back section:nth-child(4) > ul',
    )

    if (!actionsWrapper) {
      return
    }

    const getDescription = () => {
      const description = $('#card-back-name')
      return description ? description.textContent.trim() : ''
    }

    const container = createTag('div', 'button-link trello-tb-wrapper')

    const link = togglbutton.createTimerLink({
      className: 'trello',
      description: getDescription,
      projectName: getProject,
      container: '[data-testid="card-back-name"]',
      autoTrackable: true,
    })

    // Pass through click on Trello button to the timer link
    container.addEventListener('click', (e) => {
      link.click()
    })

    container.appendChild(link)

    actionsWrapper.prepend(container)
  },
  cardContainerSelector,
)

/* Checklist buttons */
togglbutton.render(
  '[data-testid="check-item-container"]:not(.toggl)',
  { observe: true, debounceInterval: 1000 },
  (elem) => {
    const getTitleText = () => {
      const description = $('#card-back-name')
      return description ? description.textContent.trim() : ''
    }

    const getTaskText = () => {
      const task = $('.ak-renderer-wrapper', elem)
      return task ? task.textContent.trim() : ''
    }

    const getDescription = () => {
      return `${getTitleText()} - ${getTaskText()}`
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

    elem
      .querySelector('[data-testid="check-item-hover-buttons"]')
      .appendChild(wrapper)
  },
  cardContainerSelector,
)
