/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('._nav:not(.toggl)', {observe: true}, function () {
  var getDescription = function () {
      return document.title;
    },
    link = togglbutton.createTimerLink({
      className: 'devdocs',
      description: getDescription
    }),
    nav = $('nav._nav');

  if (nav) {
    link.classList.add('_nav-link');
    link.style.marginTop = '0.8rem';
    nav.insertBefore(link, nav.firstChild);
  }
});