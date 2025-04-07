'use strict'

// Render on issue page
togglbutton.render(
  'span[data-testid="work-item-created"]:not(.toggl)',
  { observe: true },
  function (elem) {
    const prefix = [getId()]
      .filter(Boolean)
      .map(function (id) {
        return '#' + id
      })
      .join('')

    const title = document
      .querySelector('[data-testid="work-item-title"]')
      .textContent.trim()

    const description = [prefix, title].filter(Boolean).join(' ')

    if (elem) {
      const link = togglbutton.createTimerLink({
        className: 'gitlab',
        description: description,
        tags: tagsSelector,
        projectName: getProjectSelector,
      })

      elem.parentElement.appendChild(link)
    }
  },
)

// Render on merge request page
togglbutton.render(
  '.detail-page-description:not(.toggl)',
  { observe: true },
  function (elem) {
    console.log('elem', elem)
    const prefix = [getId()]
      .filter(Boolean)
      .map(function (id) {
        return 'MR' + id + '::'
      })
      .join('')

    const title = document
      .querySelector('[data-testid="title-content"]')
      .textContent.trim()

    const description = [prefix, title].filter(Boolean).join(' ')

    if (elem) {
      const link = togglbutton.createTimerLink({
        className: 'gitlab',
        description: description,
        tags: tagsSelector,
        projectName: getProjectSelector,
      })

      elem.appendChild(link)
    }
  },
)

function getId() {
  return document.querySelector('body').getAttribute('data-page-type-id')
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

  if (!nodeList) {
    return []
  }

  const tags = []

  for (const node of Object.values(nodeList)) {
    const tagName = node.textContent.trim()

    if (!tags.includes(tagName)) {
      tags.push(tagName)
    }
  }

  return tags
}
