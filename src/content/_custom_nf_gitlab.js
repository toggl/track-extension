/**
 * @name n4Gitlab
 * @urlAlias nfGitlabScript
 * @urlRegex git\.n4group\.eu
 */
'use strict'

togglbutton.render(
  '[data-testid="work-item-time-tracking"] [data-testid="add-time-entry-button"]:not(.toggl)',
  { observe: true },
  function (addTimeButton) {
    if (!addTimeButton) return
    addTimeButton.classList.add('toggl')

    const workItemContainer = addTimeButton.closest('[data-testid="work-item-detail"]') ||
                              addTimeButton.closest('[data-testid="work-item-container"]') ||
                              addTimeButton.closest('.work-item-page')

    const scopeEl = workItemContainer || document

    const link = togglbutton.createTimerLink({
      className: 'gitlab',
      description: () => getDescription(scopeEl),
      tags: () => tagsSelector(scopeEl),
      taskId: (projects, tasks) => extractTaskId(projects, tasks, scopeEl),
      projectName: (projects, tasks) => extractProjectName(projects, tasks, scopeEl),
    })

    link.style.whiteSpace = 'nowrap'
    link.style.flexShrink = '0'
    link.style.display = 'inline-flex'
    link.style.alignItems = 'center'
    link.style.marginRight = '8px'

    addTimeButton.insertAdjacentElement('beforebegin', link)
  }
)

togglbutton.render(
  '[data-testid="time-tracker"] [data-testid="add-time-entry-button"]:not(.toggl-mr-ready)',
  { observe: true },
  function (addTimeButton) {
    if (!addTimeButton) return
    addTimeButton.classList.add('toggl-mr-ready')

    const mrContainer = addTimeButton.closest('[data-testid="merge-request-details"]') ||
                        addTimeButton.closest('.detail-page-description') ||
                        document

    const link = togglbutton.createTimerLink({
      className: 'gitlab',
      description: getMrDescription,
      tags: () => tagsSelector(mrContainer),
      taskId: (projects, tasks) => extractTaskId(projects, tasks, mrContainer),
      projectName: (projects, tasks) => extractProjectName(projects, tasks, mrContainer),
    })

    link.style.whiteSpace = 'nowrap'
    link.style.flexShrink = '0'
    link.style.display = 'inline-flex'
    link.style.alignItems = 'center'
    link.style.marginRight = '8px'

    addTimeButton.insertAdjacentElement('beforebegin', link)
  }
)

function getDescription(context = document) {
  let iid = ''
  const iidEl = context.querySelector('[data-work-item-iid]')
  if (iidEl) {
    iid = iidEl.getAttribute('data-work-item-iid') || ''
  }

  if (!iid) {
    const match = window.location.pathname.match(/\/(?:issues|work_items)\/(\d+)/)
    iid = match ? match[1] : ''
  }

  const prefix = iid ? `#${iid}` : ''
  const titleEl = context.querySelector('[data-testid="work-item-title"]')
  const title = titleEl ? titleEl.textContent.trim() : ''

  return [prefix, title].filter(Boolean).join(' ')
}

function getMrDescription() {
  const match = window.location.pathname.match(/\/merge_requests\/(\d+)/)
  const id = match ? match[1] : ''
  const prefix = id ? `MR${id}::` : ''

  const titleEl = document.querySelector('[data-testid="title-content"]') || document.querySelector('.detail-page-description .title')
  const title = titleEl ? titleEl.textContent.trim() : ''

  return [prefix, title].filter(Boolean).join(' ')
}

function getProjectSelector(context = document) {
  const el = context.querySelector('[data-work-item-full-path]')
  if (el) {
    const fullPath = el.getAttribute('data-work-item-full-path')
    if (fullPath) {
      const parts = fullPath.split('/')
      return parts[parts.length - 1]
    }
  }

  const el2 = context.querySelector('[full-path]')
  if (el2) {
    const fullPath = el2.getAttribute('full-path')
    if (fullPath) {
      const parts = fullPath.split('/')
      return parts[parts.length - 1]
    }
  }

  const oldEl = document.querySelector(
    'a[data-track-label="project_overview"] div[data-testid="nav-item-link-label"]'
  )
  if (oldEl) {
    return oldEl.textContent.trim()
  }

  const pathParts = window.location.pathname.split('/-/')
  if (pathParts.length > 0) {
    const projectPath = pathParts[0]
    const projectParts = projectPath.split('/')
    const projectName = projectParts[projectParts.length - 1]
    if (projectName) return projectName
  }

  return ''
}

function tagsSelector(context = document) {
  const labelContainers = context.querySelectorAll('.gl-label')
  const tags = []

  for (const container of labelContainers) {
    const link = container.querySelector('a.gl-label-link')
    if (link) {
      try {
        const href = link.getAttribute('href')
        if (href) {
          const url = new URL(href, window.location.origin)
          const labelName = url.searchParams.get('label_name') || url.searchParams.get('label_name[]')
          if (labelName) {
            if (!tags.includes(labelName)) tags.push(labelName)
            continue
          }
        }
      } catch (e) {}
    }

    const text1El = container.querySelector('.gl-label-text')
    const text2El = container.querySelector('.gl-label-text-scoped')

    const text1 = text1El ? text1El.textContent.trim() : ''
    const text2 = text2El ? text2El.textContent.trim() : ''

    const fullText = text2 ? `${text1}::${text2}` : (text1 || container.textContent.trim())
    if (fullText && !tags.includes(fullText)) tags.push(fullText)
  }

  return tags
}

function extractN4GitlabTogglTaskCode(context = document) {
  const tags = tagsSelector(context)
  if (!Array.isArray(tags) || tags.length === 0) return null

  const GITLAB_LABEL_REGEX = /togge?l::?/im
  const REMOVE_TRAILING_DESCRIPTION = / .*/

  for (const tag of tags) {
    if (GITLAB_LABEL_REGEX.test(tag)) {
      return tag
        .replace(GITLAB_LABEL_REGEX, '')
        .toUpperCase()
        .replace(REMOVE_TRAILING_DESCRIPTION, '')
        .trim()
    }
  }
  return null
}

function extractTaskId(projects, tasks, context = document) {
  const code = extractN4GitlabTogglTaskCode(context)
  if (!code) return null

  const keys = Object.keys(tasks || {})
  const matchKey = keys.find((k) => (tasks[k]?.name || '').startsWith(code))
  return matchKey ? tasks[matchKey].id : null
}

function extractTaskProjectId(code, projects, tasks) {
  if (!code) return null

  const keys = Object.keys(tasks || {})
  const matchKey = keys.find((k) => (tasks[k]?.name || '').startsWith(code))
  return matchKey ? tasks[matchKey].project_id : null
}

function extractProjectName(projects, tasks, context = document) {
  const code = extractN4GitlabTogglTaskCode(context)

  if (!code) return getProjectSelector(context) || null

  const projectId = extractTaskProjectId(code, projects, tasks)
  if (!projectId) return getProjectSelector(context) || null

  const keys = Object.keys(projects || {})
  const matchKey = keys.find((k) => projects[k]?.id === projectId)
  return matchKey ? projects[matchKey].name : getProjectSelector(context) || null
}
