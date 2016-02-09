/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false, createTag:false*/

'use strict';

togglbutton.render('#sticky_header:not(.toggl)', {observer: true}, function (elem) {
  var link, container = createTag('li', 'ticket-btns'),
    duration,
    titleElem = $('h2.subject', elem),
    trackedContainer = createTag('div', 'open-box toggl-time-tracked'),
    trackedElem = $('.open-box'),
    projectElem = $('.logo_text'),
    buttonsElem = $('.ticket-actions > ul');

  link = togglbutton.createTimerLink({
    className: 'freshdesk',
    description: titleElem.innerText,
    projectName: projectElem && projectElem.innerText,
    calculateTotal: true
  });

  container.appendChild(link);
  buttonsElem.appendChild(container, buttonsElem);

  duration = togglbutton.calculateTrackedTime(titleElem.innerText);
  trackedContainer.innerHTML = "<h4 class='title'>Toggl</h4><p>Toggl time tracked: " + duration + "</p>";
  trackedElem.parentNode.insertBefore(trackedContainer, trackedElem.nextSibling);

});
