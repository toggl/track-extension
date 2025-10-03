/**
 * @name Gitea
 * @urlAlias gitea.com
 * @urlRegex *://gitea.com/*
 */
'use strict'
/* global togglbutton, $ */

togglbutton.render(
  '.time-desc:not(.toggl)',
  { observe: true },
  ($container) => {
    const link = togglbutton.createTimerLink({
      className: 'gitea',
      description: descriptionSelector,
      tags: tagsSelector,
      projectName: projectSelector,
    })
    $container.appendChild(link)
  },
)

function descriptionSelector() {
  const description = document.getElementById('issue-title-display')
  if (!description) {
    return ''
  }

  const h1 = description.querySelector('h1')
  if (!h1) {
    return description.textContent.trim()
  }

  let textContent = ''
  for (const node of h1.childNodes) {
    if (node.nodeType === Node.TEXT_NODE) {
      textContent += node.textContent
    }
  }

  return textContent.trim()
}

function projectSelector() {
  const issueContentRight = document.getElementsByClassName(
    'issue-content-right',
  )
  if (!issueContentRight || issueContentRight.length === 0) {
    return ''
  }

  const projectsSection = issueContentRight[0].querySelector(
    '[data-update-url*="projects"]',
  )
  if (!projectsSection) {
    return ''
  }

  const selectedProject = projectsSection.querySelector('a.item.muted.checked')
  if (!selectedProject) {
    return ''
  }

  return selectedProject.textContent.trim()
}

function tagsSelector() {
  const issueContentRight = document.getElementsByClassName(
    'issue-content-right',
  )[0]
  if (!issueContentRight) {
    return []
  }

  const labelsList = issueContentRight.getElementsByClassName('labels-list')[0]
  if (!labelsList) {
    return []
  }

  const $result = []
  const labelLinks = labelsList.querySelectorAll('a.item')

  for (const labelLink of labelLinks) {
    const labelSpan = labelLink.querySelector('span.ui.label')
    if (labelSpan) {
      const labelText = labelSpan.querySelector('span.gt-ellipsis')
      if (labelText) {
        const text = labelText.textContent.trim()
        $result.push(text)
      }
    }
  }

  return $result
}
