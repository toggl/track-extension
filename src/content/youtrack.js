/**
 * @name YouTrack
 * @urlAlias youtrack.cloud
 * @urlRegex *://*.youtrack.cloud/*
 */

'use strict'

/* the first selector is required for youtrack-5 and the second for youtrack-6 */
togglbutton.render(
  '.fsi-toolbar-content:not(.toggl), .toolbar_fsi:not(.toggl)',
  { observe: true },
  function (elem) {
    let description
    const numElem = $('a.issueId')
    const titleElem = $('.issue-summary')

    const projectElem = $(
      '.fsi-properties a[title^="Project"], .fsi-properties .disabled.bold',
    )

    description = titleElem.textContent
    description =
      numElem.firstChild.textContent.trim() + ' ' + description.trim()

    const link = togglbutton.createTimerLink({
      className: 'youtrack',
      description: description,
      projectName: projectElem ? projectElem.textContent : '',
    })

    elem.insertBefore(link, titleElem)
  },
)

/* new view for single issues — obligatory since YouTrack 2018.3 */
togglbutton.render(
  '.yt-issue-body:not(.toggl)',
  { observe: true },
  function (elem) {
    const parent = elem.closest('.yt-issue-view')
    const issueId = parent.querySelector('.js-issue-id').textContent
    const link = togglbutton.createTimerLink({
      className: 'youtrack-new',
      description: issueId + ' ' + $('h1').textContent.trim(),
      projectName: issueId.split('-')[0],
    })

    elem.insertBefore(link, $('.yt-issue-view__star'))
  },
)

/* new view for single issues — since YouTrack 2023.3 */
togglbutton.render(
  'div[data-test="issue-container"]:not(.toggl)',
  { observe: true },
  function (elem) {
    const reporterInfo = elem.querySelector('[data-test="reporter-info"]')

    if (reporterInfo === null) {
      console.log('Toggl Button: Reporter info not found.')
      return
    }

    const reporterInfoContainer = reporterInfo.parentElement

    const issueId = document
      .querySelector('[class*="idLink__"]')
      .textContent.trim()

    const issueTitle = $('h1').textContent.trim()

    const link = togglbutton.createTimerLink({
      description: issueId + ' ' + issueTitle,
      projectName: issueId.split('-')[0],
    })

    reporterInfoContainer.insertBefore(link, reporterInfo)
  },
)

// Agile board
togglbutton.render(
  '.yt-agile-card:not(.toggl)',
  { observe: true },
  function (elem) {
    const container = $('.yt-agile-card__summary', elem)
    const projectName = $('.yt-issue-id').textContent.split('-')

    const description = function () {
      const text = $('.yt-agile-card__summary', elem).children[1].textContent
      const id = $('.yt-agile-card__id', elem).textContent
      return (id ? id + ' ' : '') + (text ? text.trim() : '')
    }

    if (projectName.length > 1) {
      projectName.pop()
    }

    const link = togglbutton.createTimerLink({
      className: 'youtrack',
      buttonType: 'minimal',
      description: description,
      projectName: projectName.join(''),
    })

    container.appendChild(link)
  },
)

// Agile board - issue modal
togglbutton.render(
  'div[role="dialog"] div[data-test="fields-sidebar"]:not(.toggl)',
  { observe: true },
  function (elem) {
    const dialog = elem.closest('div[role="dialog"]')

    const issueIdElem = dialog.querySelector('a[href*="issue/"]')
    const issueId = issueIdElem ? issueIdElem.textContent.trim() : ''

    const issueTitleElem = dialog.querySelector('h1')
    const issueTitle = issueTitleElem ? issueTitleElem.textContent.trim() : ''

    const link = togglbutton.createTimerLink({
      className: 'youtrack-modal',
      description: issueId + ' ' + issueTitle,
      projectName: issueId.split('-')[0],
    })

    const container = elem.lastChild
    container.insertBefore(link, container.firstChild)
  },
)
