/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('.sidebar-workroom:not(.toggl)', {observe: true}, function (elem) {
  var link,
    description = function () {
      var first = document.querySelector('.user-box .details span'),
        second = document.querySelector('.sidebar-table .value-text'),
        third = document.querySelector('.sub-tasks .number');

      first = (!!first ? first.textContent.trim() : "");
      second = (!!second ? " · " + second.textContent.trim() : "");
      third = (!!third ? " · Additional tasks: " + third.textContent.trim() : "");
      return first + second + third;
    },

    project = function () {
      return 'CODEABLE';
    };

  link = togglbutton.createTimerLink({
    className: 'codeable',
    description: description,
	projectName: project
  });

  $('.user').appendChild(link);
});
