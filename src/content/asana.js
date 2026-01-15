/**
 * @name Asana
 * @urlAlias app.asana.com
 * @urlRegex *://app.asana.com/*
 */
'use strict'

const projectHeaderSelector = () => {
  // Try to look for for page project title instead.
  const projectHeader = document.querySelector(
    '.ProjectPageHeaderProjectTitle-container',
  )

  if (projectHeader) {
  return projectHeader.textContent
    .replace(/\u00a0/g, ' ') // There can be &nbsp; in Asana header content
    .trim()
  }

  const isProjectPage = document.querySelector('.ProjectPage')
  if (isProjectPage) {
    const projectTitleInput = document.querySelector(
      '.PageHeaderEditableTitle-input',
    )
    if (projectTitleInput) {
      return projectTitleInput.value.trim()
    }
  }

  return ''
}

// Board view. Inserts button next to assignee/due date.
togglbutton.render(
  '.BoardCardLayout:not(.toggl)',
  { observe: true },
  (boadCardElem) => {
    if (boadCardElem.querySelector('.toggl-button')) {
      // Due to the way this UI is rendered, we must check for existence of old buttons manually.
      return
    }

    const descriptionSelector = () =>
      boadCardElem.querySelector('.BoardCard-taskName').textContent.trim()

    const projectSelector = () => {
      const projectHeader = projectHeaderSelector()
      if (projectHeader) {
        return projectHeader
      }

      const projectPill = boadCardElem.querySelector(
        '.BoardCardPotPills-potPill[aria-label]',
      )
      if (projectPill) {
        return projectPill.getAttribute('aria-label').trim()
      }

      return ''
    }

    const link = togglbutton.createTimerLink({
      className: 'asana-board-view',
      description: descriptionSelector,
      buttonType: 'minimal',
      projectName: projectSelector,
      // N.B. Tags cannot be supported on board view as the information is not available.
    })

    const injectContainer = boadCardElem.querySelector(
      '.BoardCardLayout-actionButtons',
    )
    if (injectContainer) {
      injectContainer.insertAdjacentElement('afterbegin', link)
    }
  },
)

// SpreadSheet View V2
togglbutton.render(
  '.SpreadsheetRow .SpreadsheetTaskName:not(.toggl)',
  { observe: true },
  (element) => {
    // Due to the way this UI is rendered, we must check for existence of old buttons manually.
    if (element.parentNode.querySelector('.toggl-button')) {
      return
    }

    const getDescription = () => {
      const textarea = element.querySelector('textarea')
      return textarea ? textarea.textContent.trim() : ''
    }

    const getProject = () => {
      const isMyTasksPage = document.querySelector('.MyTasksPage')
      const isProjectPage = document.querySelector('.ProjectPage')

      if (isProjectPage) {
        const projectTitleInput = document.querySelector(
          '.PageHeaderEditableTitle-input',
        )
        if (projectTitleInput) {
          return projectTitleInput.value.trim()
        }
        return ''
      }

      if (isMyTasksPage) {
        const projectPill = element
          .closest('.SpreadsheetRow')
          .querySelector(
            '.SpreadsheetTaskRow-projectsCell .SpreadsheetPotsCell-potPill',
          )
        return projectPill ? projectPill.textContent.trim() : ''
      }

      return ''
    }

    const getTags = () => {
      const tags = element
        .closest('.SpreadsheetRow')
        .querySelectorAll(
          '.SpreadsheetTaskRow-tagsCell .SpreadsheetPotsCell-potPill',
        )

      return tags?.length > 0
        ? [...tags].map((tag) => tag.textContent.trim())
        : []
    }

    const description = getDescription()
    if (!description) {
      return
    }

    const link = togglbutton.createTimerLink({
      className: 'asana-spreadsheet',
      description: getDescription,
      projectName: getProject,
      tags: getTags,
      buttonType: 'minimal',
    })

    element.insertAdjacentElement('afterend', link)
  },
)

// Spreadsheet view V1 Inserts button next to to the task name.
// togglbutton.render(
//   '.SpreadsheetRow .SpreadsheetTaskName:not(.toggl)',
//   { observe: true },
//   function (taskNameCell) {
//     console.log('Entri in SpreadsheetView')
//     const container = taskNameCell.closest('.SpreadsheetRow')

//     if (container.querySelector('.toggl-button')) {
//       // Due to the way this UI is rendered, we must check for existence of old buttons manually.
//       return
//     }

//     const descriptionSelector = () =>
//       taskNameCell.querySelector('textarea').textContent.trim()

//     const projectSelector = () => {
//       const projectCell = container.querySelector(
//         '.SpreadsheetTaskRow-projectsCell',
//       )

//       console.log('XX_projectCell', projectCell)

//       if (!projectCell) {
//         // Try to look for for page project title instead.
//         const projectHeader = projectHeaderSelector()
//         console.log('XX_projectHeader', projectHeader)
//         return projectHeader
//       }

//       // There can be multiple projects, but we can't support trying to match multiple yet.
//       const firstProject = projectCell.querySelector(
//         '.SpreadsheetPotsCell-potPill',
//       )
//       console.log('XX_firstProject', firstProject)

//       return firstProject
//         ? firstProject.textContent.trim()
//         : projectHeaderSelector()
//     }

//     const tagsSelector = () => {
//       const tags = container.querySelectorAll(
//         '.SpreadsheetTaskRow-tagsCell .SpreadsheetPotsCell-potPill',
//       )
//       return [...tags].map((tag) => tag.textContent.trim())
//     }

//     const link = togglbutton.createTimerLink({
//       className: 'asana-spreadsheet',
//       description: descriptionSelector,
//       projectName: projectSelector,
//       tags: tagsSelector,
//       buttonType: 'minimal',
//     })

//     taskNameCell.insertAdjacentElement('afterend', link)
//   },
// )

// 2020 My Tasks view, possibly other similar views.
togglbutton.render(
  '.MyTasksTaskRow:not(.toggl)',
  { observe: true },
  function (elem) {
    if (elem.querySelector('.toggl-button')) {
      // Due to the way this UI is rendered, we must check for existence of old buttons manually.
      return
    }
    const descriptionSelector = () =>
      elem.querySelector('.TaskName textarea').textContent

    // attempt at separating projects and tags, which are not differentiated in the dom
    // assume first pill is a project and any others are tags
    // misses tags which are in the "..." overflow, and if there is a tag without a project
    const pillSelector = (type) => {
      const pills = [...elem.querySelectorAll('.Pill')].map((pill) =>
        pill.textContent.trim(),
      )
      if (type === 'project') {
        return pills.length ? pills : ''
      } else if (type === 'tags') {
        return pills.length > 1 ? pills.slice(1) : []
      }
    }

    const projectSelector = () => {
      return pillSelector('project')
    }

    const tagsSelector = () => {
      return pillSelector('tags')
    }

    const link = togglbutton.createTimerLink({
      className: 'asana-new-ui',
      description: descriptionSelector,
      projectName: projectSelector,
      tags: tagsSelector,
      buttonType: 'minimal',
    })

    const wrapper = document.createElement('div')
    wrapper.style.margin = '3px 0 0 4px'
    wrapper.appendChild(link)

    elem.appendChild(wrapper)
  },
)

// Task detail. My Tasks, Spreadsheet, Board, ...
togglbutton.render('.TaskPane:not(.toggl)', { observe: true }, (taskPaneEl) => {
  if (taskPaneEl.querySelector('.toggl-button')) {
    // Due to the way this UI is rendered, we must check for existence of old buttons manually.
    return
  }

  const descriptionSelector = () =>
    taskPaneEl.querySelector('.TaskPaneTitle textarea').textContent.trim()

  const projectSelector = () => {
    const projectElement = taskPaneEl.querySelector(
      '.TaskProjectTokenPill-tokenPillWrapper .TaskProjects-projectTokenPill span',
    )
    if (!projectElement) return ''

    return projectElement.textContent.trim()
  }

  const tagsSelector = () => {
    const tags = taskPaneEl.querySelectorAll('.TaskTagTokenPills-potPill span')
    return [...tags].map((tag) => tag.textContent.trim())
  }

  const link = togglbutton.createTimerLink({
    className: 'TaskPaneToolbar-button',
    description: descriptionSelector,
    projectName: projectSelector,
    buttonType: 'minimal',
    tags: tagsSelector,
    autoTrackable: true,
  })

  const injectContainer = taskPaneEl.querySelector(
    '.TaskPaneExtraActionsButton',
  )

  if (injectContainer) {
    injectContainer.parentNode.insertBefore(link, injectContainer.nextSibling)
  }
})
