/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render(
  '.name:not(.toggl)',
  {observe: true},
  function (elem) {
    var description = $(".content", elem).textContent,
      link = togglbutton.createTimerLink({
        className: 'workflowy',
        buttonType: 'minimal',
        description: description,
        projectName: 'workflowy'
      });
    link.style['margin-top'] = '5px';
    link.style['margin-left'] = '10px';
    $('.parentArrow', elem).appendChild(link);
  }
);