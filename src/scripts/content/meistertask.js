'use strict';

/** MeisterTask 1.0 **/

togglbutton.render('.js-box-wrapper:not(.toggl)', { observe: true }, function (
  elem
) {
  const togglButtonElement = $('.js-task-header>div>row>cell:nth-child(5)', elem);
  const description = $('.js-box-wrapper .container-name .js-task-name>div', elem)
    .textContent;
  const project = $('.js-project-name').textContent;

  const tagFunc = function () {
    let index;
    const tags = [];
    const tagList = $('.js-box-wrapper .ui-tag', elem);

    if (!tagList) {
      return [];
    }

    const tagItems = tagList.children;

    for (index in tagItems) {
      if (tagItems.hasOwnProperty(index)) {
        tags.push(tagItems[index].textContent);
      }
    }
    return tags;
  };

  const link = togglbutton.createTimerLink({
    className: 'meistertask',
    description: description,
    projectName: project,
    tags: tagFunc,
    buttonType: 'minimal'
  });

  togglButtonElement.parentNode.insertBefore(link, togglButtonElement);
});

/** MeisterTask 2.0 **/

const getDataContainer = function () {
  return document.querySelector('#mt-toggl-data');
};

const getApplicationData = function ($dataElement) {
  const dataAttr = $dataElement.getAttribute('data-toggl-json');
  const data = JSON.parse(dataAttr);
  return data;
};

const createTogglButton = function ({ taskName, projectName, tagNames }) {
  return togglbutton.createTimerLink({
    className: 'meistertask',
    buttonType: 'minimal',
    description: taskName || '',
    projectName: projectName || '',
    tags: tagNames || []
  });
};

const emptyElement = function ($btnContainer) {
  while ($btnContainer.hasChildNodes()) {
    $btnContainer.removeChild($btnContainer.lastChild);
  }
};

togglbutton.render('#mt-toggl-task-button:not(.toggl)', { observe: true }, function ($btnContainer) {
  const $dataElement = getDataContainer();
  const data = getApplicationData($dataElement);
  const $btn = createTogglButton(data);
  emptyElement($btnContainer);
  $btnContainer.appendChild($btn);
});
