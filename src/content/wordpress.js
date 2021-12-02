'use strict';

// WP 4.9
togglbutton.render('#poststuff:not(.toggl)', { observe: true }, function (elem) {
  const heading = document.querySelector('.wp-heading-inline');
  const description = function () {
    return elem.querySelector('#title').value;
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
  const targetElement = elem.querySelector('.edit-post-header__settings');
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
