'use strict';
/* global togglbutton, $ */

togglbutton.render('.time-desc:not(.toggl)',
  { observe: true },
  $container => {
    const link = togglbutton.createTimerLink({
      className: 'gitea',
      description: descriptionSelector,
      tags: tagsSelector,
      projectName: projectSelector,
    });
    $container.appendChild(link);
  }
);

function descriptionSelector () {
  const description = document.getElementById('issue-title');
  const issueId = description.nextElementSibling;
  return `${issueId.textContent} ${description.textContent}`;
}

function projectSelector () {
  const $project = document.getElementsByClassName('repo-title')[0].children[3];
  return $project ? $project.textContent.trim() : '';
}

function tagsSelector () {
  const $tags = document.getElementsByClassName('labels-list')[0].children;
  var $result = [];
  for (var element of $tags) {
    if (element.children.length > 0 && !element.children[0].classList.contains("hide")) {
      $result.push(element.children[0].textContent);
    }
  }
  return $result;
}
