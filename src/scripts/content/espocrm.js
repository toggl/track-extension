'use strict';

togglbutton.render(
  '.header-breadcrumbs:not(.toggl)',{ observe: true }, function(elem) {
    var link,
    name = $(".header-breadcrumbs");

    if (name == null) name = '';

    link = togglbutton.createTimerLink({
      className: 'espocrm',
      description: name.textContent,
      buttonType: 'minimal'
    });

    $('.header-breadcrumbs').appendChild(link);
  }
);
