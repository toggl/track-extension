'use strict';

togglbutton.render('#frmMain', {}, function(elem) {
  var link, liTag;

  link = togglbutton.createTimerLink({
    className: 'xero',
    projectName: 'Finance',
    description: $('#frmMain h1').textContent.trim()
  });

  liTag = createTag('li', 'xn-h-menu');
  liTag.appendChild(link);
  $('.xn-h-header-tabs ul').appendChild(liTag);
});
