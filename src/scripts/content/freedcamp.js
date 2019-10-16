'use strict';

togglbutton.render(
  '.todo_wrapper',
  { observe: false },
  function (elem) {
    const projectElem =
      $('.task_project_link', elem.parentElement.previousElementSibling) ||
      $('.fc_header .project_name');
    const descriptionElem = $('.td_description', elem);
    const contentElem = $('.td_content', elem);
    const link = togglbutton.createTimerLink({
      buttonType: 'minimal',
      className: 'freedcamp',
      projectName: projectElem.textContent,
      description: descriptionElem.textContent
    });
    contentElem.appendChild(link);
  }
);
