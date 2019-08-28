'use strict';

togglbutton.render('.vs-c-modal--task:not(.toggl)', { observe: true }, function (
  elem
) {
  const container = $('.vs-c-modal__actions', elem);
  const descFunc = function () {
    return $('.vs-c-task__title > .vue-simple-markdown', elem).innerText;
  };

  const link = togglbutton.createTimerLink({
    description: descFunc,
    buttonType: 'minimal'
  });

  container.prepend(link);
});
