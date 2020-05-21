'use strict';

// ticket
togglbutton.render(
  '.ConversationDetailsView:not(.toggl)',
  { observe: true },
  function (
    elem
  ) {
    const descriptionSelector = () => {
      const ticketCode = $('.CodeLabel').textContent.trim();
      const ticketSubject = $('.ConversationHeaderSubject').textContent.trim();
      return '[' + ticketCode + '] ' + ticketSubject;
    };

    const link = togglbutton.createTimerLink({
      className: 'liveagent',
      description: descriptionSelector
    });

    const wrapper = document.createElement('div');
    wrapper.className = 'togglWrapper';
    wrapper.style.textAlign = 'center';
    wrapper.style.borderBottom = '1px solid rgba(125,125,125,0.3)';
    wrapper.style.marginBottom = '1em';
    wrapper.appendChild(link);

    elem.insertBefore(wrapper, elem.firstChild);
  }
);

// knowledgebase article dialog
togglbutton.render('.ArticleDetails:not(.toggl)', { observe: true }, (articleDetails) => {
  const link = togglbutton.createTimerLink({
    className: 'liveagent',
    description: $('.ArticleContentView .DialogTitle').textContent.trim()
  });

  const wrapper = document.createElement('div');
  wrapper.className = 'togglWrapper';
  wrapper.style.textAlign = 'center';
  wrapper.style.borderBottom = '1px solid rgba(125,125,125,0.3)';
  wrapper.style.marginBottom = '1em';
  wrapper.appendChild(link);

  articleDetails.insertBefore(wrapper, articleDetails.firstChild);
});
