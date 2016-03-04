/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/

'use strict';

togglbutton.render('.btn-toolbar:not(.toggl)', {observe: true}, function () {

  var link,
    description = $('.pcs-template-body .pcs-label b').innerHTML + ' ' + $('.pcs-template-body #tmp_ref_number').innerHTML,
    project = $('.pcs-template-body .pcs-customer-name a').innerHTML;

  link = togglbutton.createTimerLink({
    className: 'zoho_books',
    description: description,
    projectName: project
  });

  link.setAttribute('style', 'margin-top: 5px');
  link.setAttribute('style', 'margin-left: 4px');

  $('.fill.header .btn-toolbar').appendChild(link);
});
