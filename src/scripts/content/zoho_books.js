/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/

'use strict';

togglbutton.render('.content-column .btn-toolbar:not(.toggl)', {observe: true}, function (elem) {

  var link,
    description = function () {
      var first = document.querySelector('.pcs-template-body .pcs-label b'),
        second = document.querySelector('.pcs-template-body #tmp_ref_number');

      first = (!!first ? first.textContent.trim() + " " : "");
      second = (!!second ? second.textContent.trim() : "");
      return first + second;
    },

    project = function () {
      var p = document.querySelector('.pcs-template-body .pcs-customer-name a');
      p = (!!p ? p.textContent.trim() : "");
      return p;
    };

  link = togglbutton.createTimerLink({
    className: 'zoho_books',
    description: description,
    projectName: project
  });

  elem.appendChild(link);
});
