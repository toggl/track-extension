'use strict';
/* global togglbutton, $ */

togglbutton.render(
  '.telomere-border .description:not(.toggl)',
  { observe: true },
  $container => {
    const descriptionSelector = () => {
      const $description = $('.text', $container.closest('.line'));
      return $description.textContent.trim();
    };

    const link = togglbutton.createTimerLink({
      className: 'scrapbox',
      description: descriptionSelector
    });

    $container.appendChild(link);
  }
);
