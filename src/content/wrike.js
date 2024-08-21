/**
 * @name Wrike
 * @urlAlias wrike.com
 * @urlRegex *://*.wrike.com/*
 */

'use strict'

togglbutton.render(
  'work-item-title:not(.toggl)',
  { observe: true },
  function (elem) {
    const container = document.querySelector('action-panel')
    const viewContainer = document.querySelector('entity-view')

    const getTitleElement = function () {
      const wsTaskTitle = elem.querySelectorAll('task-title')
      if (wsTaskTitle.length === 1 && wsTaskTitle[0].textContent !== '') {
        return wsTaskTitle[0]
      }
      return $('title')
    }

    const descriptionText = function () {
      const titleElem = getTitleElement()
      const titleElemText = titleElem ? titleElem.textContent : 'not found'

      return `${titleElemText.trim().replace(' - Wrike', '')}`.trim()
    }

    const projectText = function () {
      const projectElem = viewContainer.querySelector('wrike-tag')
      // We process the project element text content.
      return projectElem ? projectElem.textContent : ''
    }

    const link = togglbutton.createTimerLink({
      className: 'wrike',
      description: descriptionText,
      projectName: projectText,
    })

    container.prepend(link)
  },
)
