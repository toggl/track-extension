/**
 * @name Helpscout
 * @urlAlias secure.helpscout.net
 * @urlRegex *://secure.helpscout.net/*
 */

'use strict'

togglbutton.render(
  '[data-cy="ConversationHeader.Actions"]:not(.toggl)',
  { observe: true },
  function () {
    const id = $('[data-cy="Text"]').textContent
    const content = $('[data-cy="EditableTextarea"]').textContent
    const description = [id, content].join(' ')

    const link = togglbutton.createTimerLink({
      className: 'helpscout',
      description: description,
      buttonType: 'minimal',
    })

    link.setAttribute('style', 'margin-top: 10px')

    $('[data-cy="ConversationHeader.Actions"]').appendChild(link)
  },
)
