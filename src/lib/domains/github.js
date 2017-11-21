import React from 'react'
import $ from 'jquery'
import DomainController from '../domain-controller'
import TimerButton from '../../components'

export default class GithubController extends DomainController {
  static name = 'Github'
  static url = '*://github.com/*'

  constructor () {
    super({
      observe: true,
      append: 'pre',
      element: '#partial-discussion-sidebar'
    })
  }

  render (elem) {
    const $title = $('.js-issue-title')
    const $project = $('h1.public strong a, h1.private strong a')
    const existingTag = $('.discussion-sidebar-item.toggl')
    const $issueNumHeader = $('.gh-header-number')

    // Check for existing tag, create a new one if one doesn't exist or is not the first one
    // We want button to be the first one because it looks different from the other sidebar items
    // and looks very weird between them.

    if (existingTag) {
      if (existingTag.parentNode.firstChild.classList.contains('toggl')) {
        return null
      }

      existingTag.parentNode.removeChild(existingTag)
    }

    const title = $title ? $title.textContent.trim() : null
    const issueNum = $issueNumHeader ? $issueNumHeader.textContent.trim() : null
    const description = issueNum ? `${issueNum} ${title}` : title

    const projectName = $project ? $project.textContent.trim() : null

    return (
      <div className='discussion-sidebar-item toggl'>
        <TimerButton
          className='github'
          description={description}
          projectName={projectName}
        />
      </div>
    )
  }
}
