/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/

'use strict';
// observe: true
togglbutton.render('body', {}, function (elem) {
  var link, liTag;

  link = togglbutton.createTimerLink({
    className: 'capsule',
    description: $('.currentPage', elem).textContent,
    projectName: ''
  });

  liTag = document.createElement("li");
  liTag.className = 'item';
  liTag.appendChild(link);
  $('ul.pageActions').insertBefore(liTag, $('ul.pageActions li'));
});
