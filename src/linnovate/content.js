

/* ==================== Url Checking ==================== */

var previousUrl = "";

setInterval(function() {
  if(location.href !== previousUrl) {
    previousUrl = location.href;
    if(location.href.match(/issues\/\d+/)) {
      inject()
    }
  }
}, 200)



/* ==================== Injected Elements ==================== */

// html to represent the time tracking item.
var html = '<div id="issuable-time-tracker" class="block">' +
  '<div class="time_tracker time-tracking-component-wrap">' +
    '<div class="sidebar-collapsed-icon">' +
      '<div>' +
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 14" enable-background="new 0 0 12 14">' +
          '<path d="m11.5 2.4l-1.3-1.1-1 1.1 1.4 1.1.9-1.1"></path>' +
          '<path d="m6.8 2v-.5h.5v-1.5h-2.6v1.5h.5v.5c-2.9.4-5.2 2.9-5.2 6 0 3.3 2.7 6 6 6s6-2.7 6-6c0-3-2.3-5.6-5.2-6m-.8 10.5c-2.5 0-4.5-2-4.5-4.5s2-4.5 4.5-4.5 4.5 2 4.5 4.5-2 4.5-4.5 4.5"></path><path d="m6.2 8.9h-.5c-.1 0-.2-.1-.2-.2v-3.5c0-.1.1-.2.2-.2h.5c.1 0 .2.1.2.2v3.5c0 .1-.1.2-.2.2"></path>' +
        '</svg>' +
      '</div>' +
      '<div class="time-tracking-collapsed-summary"></div>' +
    '</div>' +
    '<div class="title hide-collapsed">' +
      'Time tracking' +
      '<div class="help-button pull-right">' +
        '<!--<i class="fa fa-question-circle"></i>-->' +
      '</div>' +
    '</div>' +
    '<div class="time-tracking-content hide-collapsed">' +
    '</div>' +
  '</div>' +
'</div>';

// inner html for displaying time tracking
var timeView = {
  noTrack: '<div class="time-tracking-no-tracking-pane"><span class="no-value">No estimate or time spent</span></div>',
  estimate: function(time) {
    const txt = time2str(time);
    return '<div class="time-tracking-estimate-only-pane"><span class="bold">Estimated:</span> ' + txt + '</div>';
  },
  spend: function(time, spent) {
    const estimated = time2str(time);
    const tracked = time2str(spent);
    const remaining = time2str(time - spent);
    const percent = Math.round(spent / time * 100) + "%";
    var over = false;
    if(spent - time > 0) {
      over = time2str(spent - time);
    }

    return '<div class="time-tracking-comparison-pane">' +
        '<div data-toggle="tooltip" data-placement="top" role="timeRemainingDisplay"' +

        (over ?
        ' aria-valuenow="Over by ' + remaining + '" title="" data-original-title="Over by ' + remaining + '" class="compare-meter over_estimate">'
        :
        ' aria-valuenow="Time remaining: ' + remaining + '" title="" data-original-title="Time remaining: ' + remaining + '" class="compare-meter within_estimate">'
        ) +

        '<div role="timeSpentPercent" aria-valuenow="' + percent + '" class="meter-container">' +
            '<div class="meter-fill" style="width: ' + percent + ';"></div>' +
          '</div>' +
          '<div class="compare-display-container">' +
          '<div class="compare-display pull-left">' +
            '<span class="compare-label">Spent</span> ' +
            '<span class="compare-value spent"> ' + tracked + '</span>' +
          '</div>' +
          '<div class="compare-display estimated pull-right">' +
            '<span class="compare-label">Est</span> ' +
            '<span class="compare-value"> ' + estimated + '</span>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  }
}

// records for autocompletion feature.
// IMPORTANT: the following $.ajax is a jQuery property that is available only
// in the document's scope, not in the content script isolated scope.
var autocompletion = function() {
  $.ajax({
    method: "GET",
    url: gl.GfmAutoComplete.dataSources.commands
  }).done(function(data) {
    gl.GfmAutoComplete.cachedData['/'] = data.concat([{
      aliases: [],
      name: "estimate",
      description: "Set time estimate",
      params: ["<2h 14m>"]
      // params: ["<1w 3d 2h 14m>"]
    }, {
      aliases: [],
      name: "remove_estimate",
      description: "Remove time estimate",
      params: []
    }/*, {
      aliases: [],
      name: "spend",
      description: "Add or substract spent time",
      params: ["<1h 30m | -1h 30m>"]
    }, {
      aliases: [],
      name: "remove_time_spent",
      description: "Remove spent time",
      params: []
    }*/]);
  })
}



/* ==================== Logic ================= */

var ajax = function(opts, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open(opts.method || "GET", opts.url, true)
  xhr.setRequestHeader("Authorization", "Basic " + btoa(api_token + ":api_token"))
  xhr.setRequestHeader("Content-Type", "application/json")
  xhr.addEventListener("load", function() {
    callback(xhr.response)
  })
  xhr.send(opts.body)
}

var textarea,
  timeContainer,
  task,
  project,
  api_token;

// execute time tracking command
function execCommand(command, value) {
  var value = str2time(value);
  if(value < 0) return;

  var method;
  var url = "https://www.toggl.com/api/v8/tasks";

  // set task object
  if(!task) {
    method = "POST";
    if(!project) {
      return console.error("There is no such Toggle project");
    }
    task = {
      name: taskName,
      pid: project.id,
      wid: project.wid
    }
  } else {
    method = "PUT";
    url += "/" + task.id;
  }

  // evaluate command
  if(command == "estimate") {
    task.estimated_seconds = value;
  } else if(command == "remove_estimate") {
    let estimate = task.estimated_seconds - value;
    if(!(estimate >= 0)) {
      return;
    } else {
      task.estimated_seconds = estimate;
    }
  }

  // send request to Toggl server
  ajax({
    method: method,
    url: url,
    body: JSON.stringify({task: task})
  }, function(data) {
    try {
      var data = JSON.parse(data);
      task = data.data;
      updateView(task);
      textarea.value = "";
      cleanCache(command);
      chrome.runtime.sendMessage({type: "sync"}, function(){ return; })
    } catch(err) {
      console.error(err);
      console.error(data);
    }
  })
}

// parse time string to number of seconds (e.g: "2h 1m" => 7260)
function str2time(str) {
  var value = 0;
  str.split(/\s+/).forEach(function(v) {
    var num = parseInt(v);
    var unit = v.match(/(h)|(m)/);
    if(unit[1]) return value += num * 3600;
    if(unit[2]) return value += num * 60;
  })
  return value;
}

// stringify number of seconds to time string (e.g: 7260 => "2h 1m")
function time2str(time) {
  var h, m, str = "";
  if(h = Math.floor(time / 3600)) {
    str += h + "h ";
  }
  if(m = Math.round(time % 3600 / 60)) {
    str += m + "m";
  }
  return str;
}

// prevent commenting if time tracking command was executed
function eventHandler(event) {
  var regex = /\/(estimate|remove_estimate|spend|remove_time_spent){1}\s{1}(.+)/;
  var timeCommand = textarea.value.match(regex);
  if(timeCommand) {
    event.preventDefault();
    event.stopPropagation();
    execCommand(timeCommand[1], timeCommand[2]);
  }
}

// update inner html of time tracking
function updateView(task) {
  if(!task) {
    return timeContainer.innerHTML = timeView.noTrack;
  } else if(!task.estimated_seconds) {
    timeContainer.innerHTML = timeView.noTrack;
  } else if(!task.tracked_seconds) {
    timeContainer.innerHTML = timeView.estimate(task.estimated_seconds)
  } else {
    timeContainer.innerHTML = timeView.spend(task.estimated_seconds, task.tracked_seconds)
  }
}

// get local storage item by it's value and remove it
function cleanCache(value) {
  for (var n in localStorage) {
    if(localStorage[n].includes(value)) {
      return localStorage.removeItem(n)
    }
  }
}


// initiate the extended time tracking feature
function inject() {

  // global reference to textarea
  textarea = document.querySelector(".note-textarea:not(.js-task-list-field)");

  // inject html to represent the time tracking item in the right side bar.
  var parent = document.querySelector(".issuable-context-form");
  parent.innerHTML = parent.innerHTML.replace(/(<div.+?due_date)/, function(match, p1) {
    return html + p1;
  })

  // global reference to view of time tracking feature
  timeContainer = document.querySelector(".time-tracking-content");

  // add script which injects records for autocompletion feature.
  var script = document.createElement("SCRIPT");
  script.innerHTML = "(" + autocompletion.toString() + ")()";
  document.body.appendChild(script)

  // intercept clicks and keypress on the "comment" button
  document.querySelector(".comment-btn").addEventListener('click', eventHandler)
  document.querySelector(".comment-btn").addEventListener('keypress', function(event) {
    if(event.charCode == 13 && event.ctrlKey) {
      eventHandler(event)
    }
  })

  // intercept shortcut Ctrl+Enter on the textarea
  textarea.addEventListener("keydown", function(event) {
    if(event.keyCode == 13 && event.ctrlKey) {
      eventHandler(event)
    }
  })


  // get user data and connect
  chrome.runtime.sendMessage({type: 'activate'}, function(data) {
    console.log(data)

    var projectName = document.querySelector(".project-item-select-holder").innerText;
    var taskName = document.querySelector(".issue-details").querySelector(".title").innerText;

    api_token = data.user.api_token;
    project = data.user.projects.find(project => project.name == projectName);
    if(!project) return;
    task = data.user.tasks.find(task => task.name == taskName && task.pid == project.id);
    updateView(task)
  })

}
