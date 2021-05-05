'use strict';
/* global togglbutton, $ */

togglbutton.render(
  '.task:not(.toggl)',
  { observe: true },
  element => {
    // by default the toggl button is shown on the right
    // however, if the list title is tagged with #togglLeft, the toggl button is shown on the left
    const tasksBlock = $('#tasks_block');
    if ($('#header_span ~ .tag_togglLeft') && !tasksBlock.matches('.togglLeft')) {
      tasksBlock.classList.add('togglLeft');
    }

    // parents is a function to get all parent nodes of a node
    // taken from https://stackoverflow.com/questions/8729193/how-to-get-all-parent-nodes-of-given-element-in-pure-javascript#comment85476662_8729274
    const parents = node => (
      node.parentElement
        ? parents(node.parentElement)
        : []
    ).concat([node]);

    // most information (e.g. tags) of a task is stored in its coreDiv
    // therefore parentTasks is a list of all parent tasks' coreDivs
    // the order is reversed so that closer parents come first
    const parentTasks = parents(element)
      .filter(parent => parent.matches('.task'))
      .map(parent => $('.coreDiv', parent))
      .reverse();
    const currentTask = parentTasks.shift();

    // by default only leaf tasks are togglized
    // however, togglization can be limited to branches tagged with #togglize or #togglizeAll:
    // - in a branch tagged with #togglizeAll, all tasks are togglized
    // - in a branch tagged with #togglize, only its leaf tasks are togglized
    const togglizeTaggedOnly = $('.tag_togglize') || $('.tag_togglizeAll');
    const togglizeThis = !currentTask.matches('.task_closed') && (
      togglizeTaggedOnly
        ? (
          $('#header_span ~ .tag_togglizeAll') || parentTasks.some(parent => parent.matches('.tag_togglizeAll'))
        ) || (
          ($('#header_span ~ .tag_togglize') || parentTasks.some(parent => parent.matches('.tag_togglize'))) &&
          element.matches('.leafItem')
        )
        : element.matches('.leafItem')
    );
    if (!togglizeThis) {
      return;
    }

    // helper function to extract the task text of a task
    const getTaskText = elem => $('.userContent', elem).textContent.trim();

    const descriptionSelector = () => getTaskText(currentTask);

    // by default the project is the text of the immediate parent
    // however, if a parent is tagged with #togglProject, the project is the text of this parent
    const projectSelector = () => {
      const taggedParent = parentTasks.find(parent => parent.matches('.tag_togglProject'));
      return getTaskText(taggedParent || parentTasks[0]);
    };

    const tagsSelector = () => [...currentTask.classList]
      .filter(item => item.startsWith('tag_') && !item.startsWith('tag_toggl'))
      .map(item => item.substring(4));

    const link = togglbutton.createTimerLink({
      className: 'checkvist',
      buttonType: 'minimal',
      description: descriptionSelector,
      projectName: projectSelector,
      tags: tagsSelector
    });

    currentTask.appendChild(link);
  }
);
