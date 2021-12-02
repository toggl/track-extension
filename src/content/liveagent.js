'use strict';

const button = (link, elem) => {
  const wrapper = document.createElement('div');
  wrapper.className = 'togglWrapper';
  wrapper.style.textAlign = 'center';
  wrapper.style.borderBottom = '1px solid rgba(125,125,125,0.3)';
  wrapper.style.marginBottom = '1em';
  wrapper.appendChild(link);

  elem.insertBefore(wrapper, elem.firstChild);
};

// ticket
const descriptionSelector = () => {
  try {
    const ticketCode = document.querySelector('.CodeLabel').textContent.trim();
    const ticketSubject = document.querySelector('.ConversationHeaderSubject').textContent.trim();
    return '[' + ticketCode + '] ' + ticketSubject;
  } catch (e) {
    return '';
  }
};

togglbutton.render(
  '.ConversationDetailsView:not(.toggl)', { observe: true }, (elem) => {
    const link = togglbutton.createTimerLink({
      className: 'liveagent',
      description: descriptionSelector
    });

    button(link, elem);
  }
);

// knowledgebase article dialog
const knowledgeBaseName = () => {
  try {
    return document.querySelector('.ArticleContentView .DialogTitle').textContent.trim();
  } catch (e) {
    return '';
  }
};
togglbutton.render('.ArticleDetails:not(.toggl)', { observe: true }, (articleDetails) => {
  const link = togglbutton.createTimerLink({
    className: 'liveagent',
    description: knowledgeBaseName
  });

  button(link, articleDetails);
});
