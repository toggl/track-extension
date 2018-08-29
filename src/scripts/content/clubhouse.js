'use strict';

togglbutton.render('.story-state:not(.toggl)', { observe: true }, function(
  elem
) {
  var link,
    wrap = createTag('div'),
    element = elem,
    getDescription,
    getProject;

  elem = elem.parentNode.parentNode.parentNode;

  getDescription = function() {
    return $('h2.story-name', elem).textContent;
  };

  getProject = function() {
    return $('.story-project .value', elem).textContent;
  };

  link = togglbutton.createTimerLink({
    className: 'clubhouse',
    description: getDescription,
    projectName: getProject
  });

  wrap.className = 'attribute editable-attribute';
  wrap.appendChild(link);

  element.parentNode.insertBefore(wrap, element.nextSibling);
});
