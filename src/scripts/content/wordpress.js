'use strict';

// WP 4.9
togglbutton.render('#poststuff:not(.toggl)', { observe: true }, function (elem) {
  const heading = $('.wp-heading-inline');
  const description = function () {
    return $('#title', elem).value;
  };

  const link = togglbutton.createTimerLink({
    className: 'wordpress',
    description: description
  });

  heading.append(link);
});

// WP 5.1
togglbutton.render('.edit-post-header:not(.toggl)', { observe: true }, function (
  elem
) {
  const targetElement = $('.edit-post-header__settings', elem);
  const description = function () {
    const titleInput = document.getElementById('post-title-0');
    return titleInput ? titleInput.value : '';
  };

  const link = togglbutton.createTimerLink({
    className: 'wordpress',
    description: description
  });

  targetElement.prepend(link);
});
