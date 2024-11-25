/**
 * @name Github
 * @urlAlias github.com
 * @urlRegex *://github.com/*
 */
'use strict'

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
    const numElem = $('.gh-header-number')
    const titleElem = $('.js-issue-title')
    const projectElem = $('h1.public strong a, h1.private strong a')
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

    let description = titleElem.textContent
    if (numElem !== null) {
      description = numElem.textContent + ' ' + description.trim()
    }

    const div = document.createElement('div')
    div.classList.add('discussion-sidebar-item', 'toggl')

    const link = togglbutton.createTimerLink({
      className: 'github',
      description: description,
      projectName: projectElem && projectElem.textContent,
    })

    div.appendChild(link)
    elem.prepend(div)
  },
)

// Issue Beta
togglbutton.render(
  '[data-testid="issue-viewer-metadata-pane"]:not(.toggl)',
  { observe: true },
  function (elem) {
    const titleElem = $('[data-testid="issue-title"]')
    const projectElem = $('[data-testid="project-title"]')
    const existingTag = $('.discussion-sidebar-item.toggl')

    const numElem = titleElem.parentElement.querySelector('span')

    if (existingTag) {
      if (existingTag.parentNode.firstChild.classList.contains('toggl')) {
        return
      }
      existingTag.parentNode.removeChild(existingTag)
    }

    let description = titleElem.textContent

    if (numElem !== null) {
      description = numElem.textContent + ' ' + description.trim()
    }

    const elementOfBase = document.querySelector(
      '[data-testid="sidebar-section"]',
    )

    const div = document.createElement('div')
    div.className = elementOfBase.className
    div.classList.add('discussion-sidebar-item', 'toggl')
    div.style.paddingLeft = '8px'
    div.style.paddingRight = '8px'

    console.log(projectElem?.textContent)

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
