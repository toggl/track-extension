/**
 * @name Wrike
 * @urlAlias wrike.com
 * @urlRegex *://*.wrike.com/*
 */

'use strict'

togglbutton.render(
  '.work-item-header:not(.toggl)',
  { observe: true },
  function (elem) {
    const descriptionText = function () {
      const titleTextarea = elem.querySelector(
        '[data-application="work-item-title"] textarea',
      )
      if (titleTextarea && titleTextarea.value) {
        return titleTextarea.value.trim()
      }
      const titleElem = elem.querySelector('.work-item-title')
      if (titleElem) {
        return titleElem.textContent.trim()
      }
      return document.title.replace(' - Wrike', '').trim()
    }

    const projectText = function () {
      const projectElem =
        elem.querySelector('.chip__content') ||
        document.querySelector('.work-item-location .chip__content')
      return projectElem ? projectElem.textContent.trim() : ''
    }

    const actionPanel = elem.querySelector('.action-panel')
    if (!actionPanel) return

    const link = togglbutton.createTimerLink({
      className: 'wrike',
      description: descriptionText,
      projectName: projectText,
    })

    actionPanel.prepend(link)
  },
)
