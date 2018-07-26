'use strict';

togglbutton.render(
  '.chr-QuickDetailQuickDetailEditor',
  { observe: true },
  function(elem) {
    var link,
      div,
      descriptionElem = $(
        '.chr-QuickDetailAttributeEditorWrapper--name .smb-TextInput-renderedText',
        elem
      ),
      titleElem = $('.chr-QuickDetailFormattedId', elem),
      projectElem = $('.chr-EditorsWorkItemEditor-linkSpan', elem),
      existingContainer = $('.togglContainer');

    //if page is not refreshed by F5/CTRL + F5 we need to remove existing timer container.
    if (existingContainer) {
      existingContainer.remove();
    }

    link = togglbutton.createTimerLink({
      className: 'rallydev',
      description: descriptionElem ? descriptionElem.textContent : '',
      projectName: projectElem ? projectElem.textContent : ''
    });

    div = document.createElement('div');
    div.classList.add('timer__container', 'togglContainer');
    div.appendChild(link);
    titleElem.appendChild(div);
  },
  '.chr-QuickDetailGridView, .chr-QuickDetailAttributeEditorWrapper--name .smb-TextInput, .smb-TextInput-renderedText, .chr-EditorsWorkItemEditor-linkSpan'
);
