'use strict';

togglbutton.render(
  '.case .content-top-toolbar .controls ul:not(.toggl)',
  { observe: true },
  function (elem) {
    const projectName = document.querySelector('title').textContent;
    const liTag = document.createElement('li');

    const titleFunc = function () {
      const titleElem = document.querySelector('.content h1.title');
      const ticketNum = location.href.match(/case\/(\d+)/);
      let description;

      if (titleElem !== null) {
        description = titleElem.textContent;
      }

      if (ticketNum) {
        description = '#' + ticketNum[1] + ' ' + description;
      }

      return description;
    };

    const link = togglbutton.createTimerLink({
      className: 'desk',
      description: titleFunc,
      projectName: projectName && projectName.split(': ').shift(),
      buttonType: 'minimal'
    });

    liTag.appendChild(link);
    elem.insertBefore(
      liTag,
      elem.querySelector('.case .controls.pull-right li.actions')
    );
  }
);
