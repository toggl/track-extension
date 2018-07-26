'use strict';

togglbutton.render(
  '.row:not(.toggl), .taskRow:not(.toggl)',
  { observe: true },
  function(elem) {
    if (elem.querySelectorAll('.toggl-button').length) {
      return;
    }

    var link,
      newElem,
      landmarkElem,
      newLayout = $('.tc_title', elem),
      taskElem = newLayout || $('.task', elem),
      folderElem = $('.col1', elem) || $('.taskCell:not(.tc_title)', elem),
      folderName = folderElem && folderElem.firstChild.textContent;

    folderName =
      !folderName || folderName === 'No Folder' ? '' : ' - ' + folderName;

    link = togglbutton.createTimerLink({
      className: 'toodledo',
      buttonType: 'minimal',
      description: taskElem.textContent + folderName
    });

    newElem = document.createElement('div');
    newElem.appendChild(link);
    newElem.setAttribute(
      'style',
      (newLayout ? 'display:inline-block;' : 'float:left;') +
        'width:30px;height:20px;'
    );
    if (!newLayout) {
      link.setAttribute('style', 'top:1px;');
    }

    landmarkElem =
      $('.subm', elem) ||
      $('.subp', elem) ||
      $('.ax', elem) ||
      $('.cellAction', elem) ||
      $('.cellStarSmall', elem);
    landmarkElem.parentElement.insertBefore(newElem, landmarkElem.nextSibling);
  }
);
