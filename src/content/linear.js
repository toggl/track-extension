/**
 * @name Linear
 * @urlAlias linear.app
 * @urlRegex *://linear.app/*
 */

'use strict'

// Add linear integration in table view only
togglbutton.render(
  'a[data-list-key]:not(.toggl)',
  { observe: true },
  function (elem) {
    const idElem = elem.querySelector('span[data-column-id="issueId"]')
    const id = idElem ? idElem.textContent : ''
    const titleElem = idElem?.nextSibling?.nextSibling
    const title = titleElem ? titleElem.textContent : ''

    const project = elem
      .querySelector('svg[aria-label="Project"]')
      ?.closest('div')
      ?.nextElementSibling?.textContent?.trim()

    const link = togglbutton.createTimerLink({
      description: title,
      className: 'linear-table',
      buttonType: 'minimal', // button type, if skipped will render full size
      projectName: project,
    })
    const existingTogglButton = elem.querySelector('.toggl-button')
    if (existingTogglButton) {
      // we need to remove any existing toggl buttons
      existingTogglButton.replaceChildren(link)

      return
    }
    titleElem.parentElement.insertBefore(link, titleElem.nextSibling)
  },
)

// Add linear integration for issue view and project view (single render)
togglbutton.render(
  'div[data-view-id="issue-view"]:not(.toggl), [data-restore-scroll-view="project-overview"]:not(.toggl)',
  { observe: true },
  function (elem) {
    if (elem.querySelector('.toggl-button')) return

    // Project overview page — anchor next to the project icon at the top.
    const iconBtn = elem.querySelector('button[aria-label="Choose icon"]')
    if (iconBtn) {
      const projectName = elem
        .querySelector('[aria-label="Project name"]')
        ?.textContent?.trim()

      const link = togglbutton.createTimerLink({
        description: projectName,
        className: 'linear-project-view',
        projectName: projectName,
      })
      link.style.cssText +=
        ';display:inline-flex;align-items:center;line-height:0;margin-left:8px;'

      // Linear's project header lays the icon out as a block, so a sibling
      // ends up on the next row. Wrap both in a flex row so the timer
      // button sits inline with the icon.
      const row = document.createElement('div')
      row.style.cssText = 'display:flex;align-items:center;gap:16px;'
      iconBtn.parentElement.insertBefore(row, iconBtn)
      row.appendChild(iconBtn)
      row.appendChild(link)
      return
    }

    // Issue view — anchor inside the right sidebar above the section list.
    const title = elem.querySelector('[aria-label="Issue title"]')?.textContent
    const projectElem = elem.parentElement.parentElement.querySelector(
      'svg[aria-label="Project"]',
    )
    const project = projectElem?.nextElementSibling?.textContent?.trim()

    const link = togglbutton.createTimerLink({
      description: title,
      className: 'linear-issue-view',
      projectName: project,
    })

    const sidebar =
      elem.parentElement.parentElement.lastElementChild.firstElementChild
    const firstSectionBtn = sidebar.querySelector('button[aria-expanded]')
    const sectionWrapper =
      firstSectionBtn?.parentElement?.parentElement?.parentElement
    if (sectionWrapper) {
      sectionWrapper.prepend(link)
    } else {
      sidebar.appendChild(link)
    }
  },
)

// Add linear integration in board view only
togglbutton.render(
  'a[data-board-item]:not(.toggl)',
  { observe: true },
  function (elem) {
    // Get the first contextual menu which contains ID and title
    const mainContainer = elem.querySelector('div[data-contextual-menu="true"]')

    // ID is in the first span, title is in the next sibling container's span
    const id = mainContainer?.querySelector('span > span')?.textContent
    const title = mainContainer
      ?.querySelector('div > span:last-child')
      ?.textContent?.trim()

    // Find project by looking for the span after the Project svg icon
    const project = elem
      .querySelector('svg[aria-label="Project"]')
      ?.closest('div')
      ?.nextElementSibling?.textContent?.trim()

    // Get labels from elements that have a color indicator div
    const labels = [...elem.querySelectorAll('.sc-gHYhXS')] // Elements with color indicators
      .map((colorDiv) =>
        colorDiv
          .closest('div[data-contextual-menu="true"]')
          ?.querySelector('span:last-child')
          ?.textContent?.trim(),
      )
      .filter(Boolean)

    const link = togglbutton.createTimerLink({
      description: title,
      buttonType: 'minimal', // button type, if skipped will render full size
      projectName: project,
      // For some reason, tag selection isn't working even if the like-named tags have already been created in Toggl
      tags: [id, ...labels],
    })

    elem.style.position = 'relative'
    link.style.bottom = '13px'
    link.style.right = '13px'
    link.style.position = 'absolute'

    elem.appendChild(link)
  },
)
