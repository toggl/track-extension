/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('.chr-EditorsWorkItemEditor-linkSpan:not(.toggl)', {observe: true}, function (elem) {
  var project, link, div, existingContainer, 
    description = $('.smb-TextInput-renderedText').textContent, 
    title = $('.chr-QuickDetailFormattedId'),
    project = $('.chr-EditorsWorkItemEditor-linkSpan').textContent;
  existingContainer = $('.togglContainer')

  //if page is not refreshed by F5/CTRL + F5 we need to remove existing timer container.
  if(existingContainer) {
    existingContainer.remove();
  }

  link = togglbutton.createTimerLink({
    className: 'rallydev',
    description: description,
    projectName: project
  });

  div = document.createElement("div");
  div.classList.add("timer__container", "togglContainer");
  div.appendChild(link);
  title.appendChild(div);
});
