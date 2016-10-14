/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('.story-container:not(.toggl)', {observe: true}, function (elem) {
  var link, wrap = createTag('div'),
    description = $('h2.story-name', elem).textContent,
    project = $('.story-project .value', elem).textContent;

  link = togglbutton.createTimerLink({
    className: 'clubhouse',
    description: description,
    projectName: project
  });

  wrap.className = 'attribute editable-attribute';
  wrap.appendChild(link);
  // Wait for container to be rendered
  setTimeout(function(){
    var element = $('.story-state');
    element.parentNode.insertBefore(wrap, element.nextSibling);
  }, 1000);

});
