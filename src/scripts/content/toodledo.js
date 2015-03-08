/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/

'use strict';

var retrievingEditFormData = false
var editFormDataRetrieved = false
var projects
var tags
var elems = []

function extractNames(objectMap) {
  if (Set) {
      var names = new Set()
      for (var key in objectMap) {
        names.add(objectMap[key].name)
      }
      return names
  } else {
      var names = []
      for (var key in objectMap) {
        names.push(objectMap[key].name)
      }
      return names
  }
}

function hasName(objectSet, name) {
    if (objectSet.has) {
        return objectSet.has(name)
    } else if (objectSet.indexOf) {
        return objectSet.indexOf(name) >= 0
    } else {
        return false
    }
}

function getColumnText(selector, elem) {
    return elem.querySelector(selector).textContent
}

function getTask(elem) {
    return getColumnText('.col0', elem)
}

function getFolder(elem) {
    return getColumnText('.col1', elem)
}

function getContext(elem) {
    return getColumnText('.col512', elem)
}

function getGoal(elem) {
    return getColumnText('.col1024', elem)
}

function getTags(elem) {
    var splitTags = getColumnText('.col128', elem).split(',')
    var length = splitTags.length
    var taskTags = []
    for (var i = 0; i < length; ++i) {
        taskTags.push(splitTags[i].trim())
    }
    return taskTags
}

function getTimerDescription(elem) {
    return getTask(elem)
}

function getTimerProject(elem) {
    
    var project = getFolder(elem)
    if (hasName(projects, project))
    {
        return project
    }

    project = getGoal(elem)
    if (hasName(projects, project))
    {
        return project
    }

    project = getContext(elem)
    if (hasName(projects, project))
    {
        return project
    }

    var taskTags = getTags(elem)
    var length = taskTags.length
    for (var i = 0; i < length; ++i) {
        if (hasName(projects, taskTags[i]))
        {
            return taskTags[i]
        }
    }
    return ''
}

function getTimerTags(elem) {

    var taskTags = getTags(elem)
    var length = taskTags.length
    var timerTags = []
    for (var i = 0; i < length; ++i) {
        if (hasName(tags, taskTags[i]))
        {
            timerTags.push(taskTags[i])
        }
    }
    return timerTags
}

function renderButton(elem) {

  var link = togglbutton.createTimerLink({
    className: 'toodledo',
    buttonType: 'minimal',
    description: getTimerDescription(elem),
    projectName: getTimerProject(elem),
    tags: getTimerTags(elem).join()
  });

  var newElem = document.createElement('div');
  newElem.appendChild(link);
  newElem.setAttribute('style', 'float:left;width:30px;height:20px;position:relative;');
  var landmarkElem = $('.subm', elem) || $('.subp', elem) || $('.ax', elem);
  elem.insertBefore(newElem, landmarkElem.nextSibling);
}

function renderButtons() {
    var length = elems.length
    for (var i=0; i<length; ++i) {
        renderButton(elems[i])
    }
    elems = []
}

togglbutton.render('.row:not(.toggl)', {observe: true}, function (elem) {
  elems.push(elem)

  if (!retrievingEditFormData) {
    if (editFormDataRetrieved) {
        renderButtons()
    } else {
        retrievingEditFormData  = true
        chrome.extension.sendMessage({type: 'getEditFormData'}, function (response) {
          if (response && response.success ) {
              projects = extractNames(response.projects)
              tags = extractNames(response.tags)
              renderButtons()
              retrievingEditFormData = false
              editFormDataRetrieved = true
          }
        });
    }
  }
});
