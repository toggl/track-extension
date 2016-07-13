/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';


togglbutton.render('#layout-container:not(.toggl)', {observe: true}, function (elem) {
  var link,
  description,
  project = $('.objectlink.breadcrumb-link.first-item', elem).textContent;

  description = function(){
    var delimiter = ' > ',
    w_type = window.location.pathname.split('/')[1],
    w_id = $('#layout-content').innerHTML.split('detailObjID":"')[1].split('"')[0],
    w_name = $('.detail-name-edit', elem).textContent;

    return w_type + delimiter + w_name + delimiter + w_id;
  };

  link = togglbutton.createTimerLink({
    className: 'attask',
    description: description,
    projectName: project
  });

  link.style.float = 'right';

  $('.user-actions').appendChild(link);

});
