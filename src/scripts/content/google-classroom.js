'use strict';

togglbutton.render('div[data-without-stream-item-materials]', { observe: true }, elem => {
  if ($('.toggl-button', elem)) {
    return;
  }

  const title = $('h1', elem);
  const titleFunc = () => {
    return title ? title.textContent.trim() : '';
  };

  const link = togglbutton.createTimerLink({
    className: 'google-classroom',
    description: titleFunc
  });

  link.style.margin = '1rem 1rem 0';
  link.style.whiteSpace = 'nowrap';

  title.nextSibling.appendChild(link);
});
