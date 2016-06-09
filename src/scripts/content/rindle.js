/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('.time__tracker .toggl__container:not(.toggl)', { observe: true }, function (elem) {
  var link,
    descFunc,
    projectName = $('.navbar-default .dropdown .navbar-brand .ng-scope').textContent;

  descFunc = function () {
    var card = $('.toggl__card-title', elem);
    if (!!card) {
      return card.textContent;
    }
    return null;
  };

  link = togglbutton.createTimerLink({
    className: 'rindle',
    description: descFunc,
    projectName: projectName
  });

  elem.appendChild(link);
});