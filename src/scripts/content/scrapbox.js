'use strict';
/* global togglbutton, $ */

togglbutton.render(
  '.telomere-border .description:not(.toggl)',
  { observe: true },
  $container => {
    const descriptionSelector = () => {
      const $description = $container.closest('.line').querySelector('.text');
      return $description.textContent.trim();
    };

    const link = togglbutton.createTimerLink({
      className: 'scrapbox',
      description: descriptionSelector
    });

    $container.appendChild(link);
  }
);
