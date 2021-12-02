'use strict';

togglbutton.render('#ctl00_ctl00_PageBody_tktHeader', {}, function () {
  const object = $('#ctl00_ctl00_PageBody_lbSubject');
  let description = object.textContent;
  const returnPos = description.indexOf('\n');
  if (returnPos > 0) {
    description = description.substr(0, description.indexOf('\n'));
  }

  const link = togglbutton.createTimerLink({
    className: 'sherpadesk',
    description: description
  });

  object.parentElement.appendChild(link);
});
