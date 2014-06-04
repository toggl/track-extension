/*jslint indent: 2, unparam: true*/
/*global $: false, document: false, togglbutton: false*/

'use strict';
togglbutton.render('#frmMain', {}, function (elem) {
  var link, liTag;

  link = togglbutton.createTimerLink({
    className: 'xero',
    description: $('#frmMain h1').innerText,
    projectName: 'Finance'
  });

  liTag = document.createElement("li");
  liTag.className = 'xn-h-header-info-item xero';
  liTag.appendChild(link);
  $('ul.xn-h-header-info').insertBefore(liTag, $('ul.xn-h-header-info li'));
});
