/**
 * @name Github
 * @urlAlias github.com
 * @urlRegex *://github.com/*
 */
'use strict'

// Strip GitHub's injected "Edit issue title" label (a visually-hidden node)
// out of the tracked title so it isn't prepended to the description (see #2438).
const readClean = (node) => {
  const clone = node.cloneNode(true)
  clone
    .querySelectorAll(
      'button, [role="button"], [class*="VisuallyHidden"], .sr-only',
    )
    .forEach((n) => n.remove())

  return clone.textContent.trim()
}

const getIssueTitleText = (titleElem) => {
  if (!titleElem) {
    return ''
  }

  const titleNode = titleElem.matches('.markdown-title, bdi')
    ? titleElem
    : titleElem.querySelector('.markdown-title, bdi')

  return readClean(titleNode || titleElem)
}

// Match the number span (e.g. "#2438") by shape, not DOM position, so the
// inline-edit wrapper span isn't picked up instead (see #2438).
const getIssueNumberText = (titleElem) => {
  const scope =
    (titleElem && titleElem.closest('h1')) ||
    (titleElem && titleElem.parentElement)

  if (!scope) {
    return ''
  }

  const numElem = Array.prototype.find.call(
    scope.querySelectorAll('span'),
    (span) => /^#\d+$/.test(span.textContent.trim()),
  )

  return numElem ? numElem.textContent.trim() : ''
}

// We need it to get the issue name, the tag value is being changed dynamically
const getPaneDescription = async (elem) => {
  return new Promise((resolve) => {
    const description = setInterval(() => {
      const titleElem = elem.querySelector('#__primerPortalRoot__ bdi')
      const numElem = titleElem.parentElement.lastChild

      if (!!titleElem.textContent) {
        clearInterval(description)
        resolve(`${numElem.textContent} ${titleElem.textContent.trim()}`)
      }
    }, 1000)
  })
}

// Issue and Pull Request Page
togglbutton.render(
  '#partial-discussion-sidebar:not(.toggl)',
  { observe: true },
  function (elem) {
    // Try new React-based PR/Issue page selectors first, then fall back to legacy
    const numElem =
      $('h1[data-component="PH_Title"] .fgColor-muted.f1-light') ||
      $('.gh-header-number')
    const titleElem =
      $('h1[data-component="PH_Title"] .markdown-title') ||
      $('.js-issue-title')
    // New GitHub PR pages no longer have a repo name element in the header;
    // extract from the URL path instead (e.g. /owner/repo/...)
    const projectElem = $('h1.public strong a, h1.private strong a')
    const projectName = projectElem
      ? projectElem.textContent
      : (window.location.pathname.split('/')[2] || null)
    const existingTag = $('.discussion-sidebar-item.toggl')

    // Check for existing tag, create a new one if one doesn't exist or is not the first one
    // We want button to be the first one because it looks different from the other sidebar items
    // and looks very weird between them.

    if (existingTag) {
      if (existingTag.parentNode.firstChild.classList.contains('toggl')) {
        return
      }
      existingTag.parentNode.removeChild(existingTag)
    }

    if (!titleElem) {
      return
    }

    let description = getIssueTitleText(titleElem)
    if (numElem !== null) {
      description = numElem.textContent.trim() + ' ' + description
    }

    const div = document.createElement('div')
    div.classList.add('discussion-sidebar-item', 'toggl')

    const link = togglbutton.createTimerLink({
      className: 'github',
      description: description,
      projectName: projectName,
    })

    div.appendChild(link)
    elem.prepend(div)
  },
)

// Issue Beta
togglbutton.render(
  '[data-testid="issue-viewer-metadata-container"]:not(.toggl)',
  { observe: true },
  function (elem) {
    // This is needed as for this case it will enter in the "Project Page side pane" case.
    if ($('[data-testid="side-panel-focus-target"]')) {
      return
    }

    const titleElem = $('[data-testid="issue-title"]')
    const projectElem = $('[data-testid="project-title"]')
    const existingTag = $('.discussion-sidebar-item.toggl')

    if (existingTag) {
      if (existingTag.parentNode.firstChild.classList.contains('toggl')) {
        return
      }
      existingTag.parentNode.removeChild(existingTag)
    }

    let description = getIssueTitleText(titleElem)
    const numText = getIssueNumberText(titleElem)

    if (numText) {
      description = numText + ' ' + description
    }

    const elementOfBase = document.querySelector(
      '[data-testid="sidebar-section"]',
    )

    const div = document.createElement('div')
    div.className = elementOfBase.className
    div.classList.add('discussion-sidebar-item', 'toggl')
    div.style.paddingLeft = '8px'
    div.style.paddingRight = '8px'

    const link = togglbutton.createTimerLink({
      className: 'github',
      description: description,
      projectName: projectElem && projectElem.textContent,
    })

    div.appendChild(link)
    elem.prepend(div)
  },
)

// Project Page side pane
togglbutton.render(
  'div[role="dialog"]:not(.toggl)',
  { observe: true },
  async function (elem) {
    const projectElem = document.querySelector("div[role='navigation'] h1")

    const description = await getPaneDescription(elem)
    const targetParent = document.querySelector(
      "div[data-testid='issue-viewer-metadata-container']",
    )
    const targetChildSection =
      targetParent &&
      targetParent.querySelector("div[data-testid='sidebar-section']")

    if (targetChildSection === null) {
      return
    }

    const div = document.createElement('div')
    div.className = targetChildSection.className
    div.style.paddingLeft = '8px'

    const link = togglbutton.createTimerLink({
      className: 'github',
      description: description,
      projectName: projectElem ? projectElem.textContent.trim() : '',
    })

    div.appendChild(link)
    targetParent.prepend(div)
  },
)

// Project Page
togglbutton.render(
  '.js-project-card-details .js-comment:not(.toggl)',
  { observe: true },
  function (elem) {
    const getDescription = () => {
      const titleElem = $('.js-issue-title')

      if (!titleElem) {
        return ''
      }
      const issueNumberElem = $('.js-issue-title + span')
      const issueTitle = titleElem.textContent.trim()

      // Check if the text starts with a '#' followed by digits, indicating an issue number
      if (issueNumberElem && /^#\d+/.test(issueNumberElem.textContent)) {
        return issueNumberElem.textContent.trim() + ' ' + issueTitle
      }

      return issueTitle
    }

    const projectElem = $('h1.public strong a, h1.private strong a')

    const link = togglbutton.createTimerLink({
      className: 'github',
      description: getDescription,
      projectName: projectElem && projectElem.textContent,
    })

    const wrapper = createTag(
      'div',
      'discussion-sidebar-item js-discussion-sidebar-item',
    )
    wrapper.appendChild(link)

    const target = $('.discussion-sidebar-item')
    target.parentNode.insertBefore(wrapper, target)
  },
)
