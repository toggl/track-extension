'use strict';

// Basecamp Next
togglbutton.render(
  'section.todos li.todo:not(.toggl)',
  { observe: true },
  function (elem) {
    const behavior = 'hover_content';
    const container = $('.wrapper', elem);

    if (container === null) {
      return;
    }

    const projectFunc = function () {
      const p = $('.project > title') || $('.project > header > h1 > a');
      return p ? p.textContent : '';
    };

    const link = togglbutton.createTimerLink({
      className: 'basecamp',
      description: $('.content_for_perma', elem).textContent,
      projectName: projectFunc
    });

    link.setAttribute('data-behavior', behavior);
    link.addEventListener('click', function (e) {
      if (link.getAttribute('data-behavior') === '') {
        link.setAttribute('data-behavior', behavior);
      } else {
        link.setAttribute('data-behavior', '');
      }
    });

    const spanTag = document.createElement('span');
    container.appendChild(spanTag.appendChild(link));
  }
);

// Basecamp Classic
togglbutton.render(
  '.items_wrapper .item > .content:not(.toggl)',
  { observe: true },
  function (elem) {
    const behavior = 'selectable_target';

    const link = togglbutton.createTimerLink({
      className: 'basecamphq',
      description: elem.querySelector('span.content > span').textContent.trim(),
      projectName: $('.project')
        ? ($('.project > title') || $('.project > header > h1 > a')).textContent
        : ''
    });

    link.setAttribute('data-behavior', '');
    link.addEventListener('click', function (e) {
      if (link.getAttribute('data-behavior') === '') {
        link.setAttribute('data-behavior', behavior);
      } else {
        link.setAttribute('data-behavior', '');
      }
    });

    const spanTag = document.createElement('span');
    $('.content', elem).appendChild(spanTag.appendChild(link));
  }
);

// Basecamp 3
togglbutton.render('article.todolist .todos li.todo:not(.toggl)', { observe: true }, function (
  elem
) {
  const parent = $('.checkbox__content', elem);
  const description = parent.childNodes[1].textContent.trim();
  const project = document.querySelector('meta[name="current-page-subtitle"]').getAttribute('content');

  const metadata = $('.metadata', parent);

  const link = togglbutton.createTimerLink({
    buttonType: metadata ? null : 'minimal',
    className: 'basecamp3-todos',
    description: description,
    projectName: project
  });

  const container = metadata || parent;
  container.appendChild(link);
});

// Basecamp 3 - Card table
togglbutton.render('header.todo__header:not(.toggl)', { observe: true }, function (
  elem
) {
  const container = elem.querySelector('h1');
  const description = elem.querySelector('h1 > a').textContent.trim();
  const project = document.querySelector('meta[name="current-page-subtitle"]').getAttribute('content');

  const link = togglbutton.createTimerLink({
    buttonType: 'minimal',
    description: description,
    projectName: project
  });

  container.appendChild(link);
});
