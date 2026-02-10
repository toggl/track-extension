/**
 * @name Custom Gitlab Script (N4)
 * @urlAlias nfGitlabScript
 * @urlRegex gitlab.com
 */
'use strict'

// ---------------------------
// Issues (new GitLab UI)
// ---------------------------
togglbutton.render(
  'span[data-testid="work-item-created"]:not(.toggl)',
  { observe: true },
  function (createdSpan) {
    if (!createdSpan) return
    createdSpan.classList.add('toggl')

    const id = getIdFromBody()
    const prefix = id ? `#${id}` : ''

    const titleEl = document.querySelector('[data-testid="work-item-title"]')
    const title = titleEl ? titleEl.textContent.trim() : ''

    const description = [prefix, title].filter(Boolean).join(' ')

    const link = togglbutton.createTimerLink({
      className: 'gitlab',
      description,
      tags: tagsSelector,
      taskId: (projects, tasks) => extractTaskId(projects, tasks),
      projectName: (projects, tasks) => extractProjectName(projects, tasks),
    })

    createdSpan.insertAdjacentElement('afterend', link)
  },
)

// ---------------------------
// Merge Requests (new GitLab UI)
// ---------------------------
togglbutton.render(
  '.detail-page-description:not(.toggl)',
  { observe: true },
  function (descBlock) {
    if (!descBlock) return
    descBlock.classList.add('toggl')

    const id = getIdFromBody()
    const prefix = id ? `MR${id}::` : ''

    const titleEl = document.querySelector('[data-testid="title-content"]')
    const title = titleEl ? titleEl.textContent.trim() : ''

    const description = [prefix, title].filter(Boolean).join(' ')

    const link = togglbutton.createTimerLink({
      className: 'gitlab',
      description,
      tags: tagsSelector,
      taskId: (projects, tasks) => extractTaskId(projects, tasks),
      projectName: (projects, tasks) => extractProjectName(projects, tasks),
    })

    descBlock.insertAdjacentElement('afterbegin', link)
  },
)

// ---------------------------
// Shared helpers
// ---------------------------
function getIdFromBody() {
  const body = document.querySelector('body')
  return body ? body.getAttribute('data-page-type-id') : ''
}

function getProjectSelector() {
  const el = document.querySelector(
    'a[data-track-label="project_overview"] div[data-testid="nav-item-link-label"]',
  )
  return el ? el.textContent.trim() : ''
}

function tagsSelector() {
  const nodeList = document.querySelectorAll(
    '[data-testid="selected-label-content"] span.gl-label-text',
  )

  const tags = []
  for (const node of Object.values(nodeList || {})) {
    const tagName = (node.textContent || '').trim()
    if (tagName && !tags.includes(tagName)) tags.push(tagName)
  }
  return tags
}

function extractN4GitlabTogglTaskCode() {
  const tags = tagsSelector()
  if (!Array.isArray(tags) || tags.length === 0) return null

  const GITLAB_LABEL_REGEX = /togg(e|)l(::|:)/gim
  const REMOVE_TRAILING_DESCRIPTION = / .*/

  for (const tag of tags) {
    if (GITLAB_LABEL_REGEX.test(tag)) {
      // Reset regex lastIndex since we use 'g' flag
      GITLAB_LABEL_REGEX.lastIndex = 0
      return tag
        .replace(GITLAB_LABEL_REGEX, '')
        .toUpperCase()
        .replace(REMOVE_TRAILING_DESCRIPTION, '')
        .trim()
    }
  }
  return null
}

function extractTaskId(projects, tasks) {
  const code = extractN4GitlabTogglTaskCode()
  if (!code) return {}

  const keys = Object.keys(tasks || {})
  const matchKey = keys.find((k) => (tasks[k]?.name || '').startsWith(code))
  return matchKey ? tasks[matchKey].id : {}
}

function extractTaskProjectId(code, projects, tasks) {
  if (!code) return null

  const keys = Object.keys(tasks || {})
  const matchKey = keys.find((k) => (tasks[k]?.name || '').startsWith(code))
  return matchKey ? tasks[matchKey].project_id : null
}

function extractProjectName(projects, tasks) {
  const code = extractN4GitlabTogglTaskCode()

  if (!code) return getProjectSelector() || null

  const projectId = extractTaskProjectId(code, projects, tasks)
  if (!projectId) return getProjectSelector() || null

  const keys = Object.keys(projects || {})
  const matchKey = keys.find((k) => projects[k]?.id === projectId)
  return matchKey ? projects[matchKey].name : getProjectSelector() || null
}
