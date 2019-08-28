'use strict';

togglbutton.render(
  '.chr-PeriscopeContainer',
  { observe: true },
  function (elem) {
    const descriptionElem = $(
      '.chr-QuickDetailAttributeEditorWrapper--name .smb-TextInput-renderedText',
      elem
    );
    const titleElem = $('.chr-QuickDetailFormattedId', elem);
    const projectElem = $('.chr-EditorsWorkItemEditor-linkSpan', elem);
    const existingContainer = $('.togglContainer');

    // if page is not refreshed by F5/CTRL + F5 we need to remove existing timer container.
    if (existingContainer) {
      existingContainer.remove();
    }

    const link = togglbutton.createTimerLink({
      className: 'rallydev',
      description: descriptionElem ? descriptionElem.textContent : '',
      projectName: projectElem ? projectElem.textContent : ''
    });

    const div = document.createElement('div');
    div.classList.add('timer__container', 'togglContainer');
    div.appendChild(link);
    titleElem.appendChild(div);
  },
  '.chr-QuickDetailGridView, .chr-QuickDetailAttributeEditorWrapper--name .smb-TextInput, .smb-TextInput-renderedText, .chr-EditorsWorkItemEditor-linkSpan'
);
