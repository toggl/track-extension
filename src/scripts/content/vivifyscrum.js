'use strict';

togglbutton.render('.vs-c-modal--task:not(.toggl)', { observe: true }, function(
  elem
) {
  var link,
    container = $('.vs-c-modal__actions', elem),
    descFunc = function() {
      return $('.vs-c-task__title > .vue-simple-markdown', elem).innerText;
    };

  link = togglbutton.createTimerLink({
    description: descFunc,
    buttonType: 'minimal'
  });

  container.prepend(link);
});
