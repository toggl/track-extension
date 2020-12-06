'use strict';

// Single task/issue/project in main view
togglbutton.render('#layout-container:not(.toggl)', { observe: true }, function (
  elem
) {
  const description = function () {
    const wName = $('.detail-name-edit', elem).textContent;
    return wName + ' ' + window.location.href;
  };

  const link = togglbutton.createTimerLink({
    className: 'workfront',
    description: description
  });

  // Create container element
  const tContainer = document.createElement('li');
  tContainer.id = 'nav-toggl';
  tContainer.className = 'navbar-item';
  tContainer.setAttribute('style', 'height: 62px; vertical-align: middle;');

  // Add Toggl button to container
  tContainer.appendChild(link);

  // Add container to navbar
  const navgroup = $('.navbar-item-group.right');
  navgroup.insertBefore(tContainer, navgroup.children[0]);
});

// Multiple tasks in project view
const t = $('#minified-scripts').innerHTML;
const userName = /\/user\/view.*?label:"(.*?)"/.exec(t)[1];
const myTasks = $$('td[data-workvalue*="' + userName + '"]');

myTasks.forEach(function (e) {
  const parentElement = e.parentElement;
  const objid = parentElement.getAttribute('objid');
  let taskName = $('td[valuefield=name]', parentElement);
  let l = $('.objectlink', taskName);
  let url;
  let name;

  url = l.href;
  name = l.innerText;

  if (url.length > 30 && name.length > 3) {
    togglbutton.render(
      '[objid="' + objid + '"]:not(.toggl)',
      { observe: true },
      function (elem) {
        taskName = $('td[valuefield=name]', elem);
        l = $('.objectlink', taskName);
        url = l.href;
        name = l.innerText;
        const description = function () {
          return name + ' ' + url;
        };

        const link = togglbutton.createTimerLink({
          className: 'workfront',
          description: description,
          buttonType: 'minimal'
        });

        // Add Toggl button to container
        const nameDiv = $('div', taskName);
        const nameDivSpan = $('span', nameDiv);
        nameDiv.insertBefore(link, nameDivSpan);
      }
    );
  }
});
