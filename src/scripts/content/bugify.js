/*jslint indent: 2, unparam: true*/
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('.wrapper:not(.toggl):not(.footer)', {observe: true}, function (elem) {
  var bugifyStateBox = $('.box'), bugifyTogglBox = createTag('div', 'box white');
  var bugifyTogglButton = togglbutton.createTimerLink({
    className: 'bugify',
    description: $('h1.title').innerText.replace(/(\r\n|\n|\r)/gm,"").substring(1) ? $('h1.title').innerText.replace(/(\r\n|\n|\r)/gm,"").trim() : '',
    projectName: $('.box table tr:nth-child(3) td.issue-overview-data a').title ? $('.box table tr:nth-child(3) td.issue-overview-data a').title.trim() : '',
    calculateTotal: true
  });
  bugifyTogglButton.classList.add('button', 'green');
  bugifyTogglBox.appendChild(bugifyTogglButton);
  bugifyStateBox.parentNode.insertBefore(bugifyTogglBox, bugifyStateBox);
});