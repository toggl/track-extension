'use strict';

togglbutton.render(
  '.pd-incident-actions:not(.toggl)',
  { observe: true },
  function() {
    /*jslint browser:true */
    var link,
      description,
      projectElem = $('.pd-service-name__name a');

    description = document.title.replace(
      /\[#(\d*)\]([\w\W]*) - PagerDuty/g,
      'Pagerduty $1:$2'
    );

    link = togglbutton.createTimerLink({
      className: 'pagerduty',
      description: description,
      projectName: projectElem && projectElem.textContent
    });

    $('.pd-incident-actions').appendChild(link);
  }
);

// New interface 09-2018
togglbutton.render(
  '.pd-page.pd-page--incidents:not(.toggl)',
  { observe: true },
  function(mod) {
    /*jslint browser:true */
    var link,
      description = document.title.replace(
        /\[#(\d*)\]([\w\W]*) - PagerDuty/g,
        'Pagerduty $1:$2'
      );
      projectElem = $('.pd-service-name__name a');

    if(description) {
      link = togglbutton.createTimerLink({
        className: 'pagerduty-09-2018',
        description: description,
        projectName: projectElem && projectElem.textContent
      });

      $('.pd-action-bar__left-items').appendChild(link);
      mod.classList.add('toggl');
    }
  }
);
