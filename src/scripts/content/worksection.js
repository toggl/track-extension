'use strict';

togglbutton.render('.task:not(.toggl)', { observe: true }, function (elem) {
  const projectElem = $('#client_name b');
  let taskElem = $('.task h1');

  if (!taskElem) {
    return;
  }

  taskElem = taskElem.childNodes[2].textContent.trim();

  const link = togglbutton.createTimerLink({
    className: 'worksection',
    description: taskElem,
    projectName: projectElem && projectElem.textContent.trim()
  });
  link.classList.add('norm');

  $('#tmenu2', elem).appendChild(link);
});
