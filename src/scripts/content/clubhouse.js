'use strict';
import CustomTemplateMessenger from '../lib/customTemplateMessenger';
import CustomTemplateParser from '../lib/customTemplateParser';

togglbutton.render('.story-state:not(.toggl)', { observe: true }, async function (
  elem
) {
  const wrap = createTag('div');
  const element = elem;
  elem = elem.parentNode.parentNode.parentNode;

  const getEpicName = function () {
    return $('#story-dialog-epic-dropdown .value', elem).textContent;
  };

  const getProjectName = function () {
    return $('.story-project .value', elem).textContent;
  };

  const getStoryId = function () {
    return $('.story-dialog .right-column .story-id input', elem).value;
  };

  const getStoryTitle = function () {
    return $('h2.story-name', elem).textContent;
  };

  // Matches field names to appropriate get function
  const customTemplateMap = {
    epicName: getEpicName,
    projectName: getProjectName,
    storyId: getStoryId,
    storyTitle: getStoryTitle
  };

  const templateSettings = new CustomTemplateMessenger('getClubhouseCustomTemplateSettings');
  await templateSettings.fetchSettings();
  const templateParser = new CustomTemplateParser(customTemplateMap, templateSettings.customTemplate);

  const link = togglbutton.createTimerLink({
    className: 'clubhouse',
    description: templateSettings.useCustomTemplate ? templateParser.parse() : getStoryTitle,
    projectName: getProjectName
  });

  wrap.className = 'attribute editable-attribute';
  wrap.appendChild(link);

  element.parentNode.insertBefore(wrap, element.nextSibling);
});
