/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false, createTag:false*/

'use strict';

togglbutton.render('#Pagearea:not(.toggl)', {observe: true}, function (elem) {
  var link, container = createTag('li', 'ticket-btns'),
    duration,
    description,
    titleElem = $('h2.subject', elem),
    idElem = $('#ticket-display-id'),
    trackedContainer = createTag('div', 'open-box toggl-time-tracked'),
    trackedElem = $('.open-box'),
    projectElem = $('.logo_text'),
    buttonsElem = $('.ticket-actions > ul');

  description = idElem.innerText + ' ' + titleElem.innerText;
  link = togglbutton.createTimerLink({
    className: 'freshdesk',
    description: description,
    projectName: projectElem && projectElem.innerText,
    calculateTotal: true
  });

  container.appendChild(link);
  buttonsElem.appendChild(container, buttonsElem);

  duration = togglbutton.calculateTrackedTime(description);
  trackedContainer.innerHTML = "<h4 class='title'>Toggl</h4><p>Toggl time tracked: " + duration + "</p>";
  trackedElem.parentNode.insertBefore(trackedContainer, trackedElem.nextSibling);

});
