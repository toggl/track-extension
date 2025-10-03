'use strict'

togglbutton.render(
  '.o_control_panel .breadcrumb:not(.toggl)',
  { observe: true },

  ($container) => {
    const descriptionSelector = () => {
      const $description = $('.o_last_breadcrumb_item.active .text-truncate')
      return $description.textContent.trim()
    }

    const link = togglbutton.createTimerLink({
      className: 'odoo',
      description: descriptionSelector,
    })

    $container.appendChild(link)
  },
)
