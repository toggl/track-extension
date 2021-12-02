'use strict';

togglbutton.render(
  '#main-header:not(.toggl)',
  { observe: true },
  function (elem) {
    const titleFunc = function () {
      const title = $('.hp-header-title');
      if (!title) {
        return '';
      }

      const titleSpan = $('span', title);
      return titleSpan ? titleSpan.textContent : '';
    };

    const projectNameFunc = function () {
      const folder = $('.hp-pad-folder-name');
      if (!folder) {
        return '';
      }

      const textList = folder.querySelectorAll('.hp-breadcrumbs-text');

      return textList.length === 0 ? '' : textList[textList.length - 1].textContent;
    };

    const link = togglbutton.createTimerLink({
      className: 'dropbox-paper',
      description: titleFunc,
      projectName: projectNameFunc,
      buttonType: 'minimal'
    });

    const wrapper = createTag('div');
    wrapper.className = 'toggl dropbox-paper-wrapper';
    wrapper.appendChild(link);

    const divider = $('.main-header-divider', elem);
    divider.parentNode.insertBefore(wrapper, divider.nextSibling);
  });
