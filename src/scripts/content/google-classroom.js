'use strict';

togglbutton.render('div[data-without-stream-item-materials]', { observe: true }, elem => {
  if ($('.toggl-button', elem)) {
    return;
  }

  const titleFunc = () => {
    const title = $('h1', elem);
    return title ? title.textContent.trim() : '';
  };

  const link = togglbutton.createTimerLink({
    className: 'google-classroom',
    description: titleFunc
  });

  $('.rec5Nb.QRiHXd', elem).appendChild(link);
});
