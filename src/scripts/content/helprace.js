togglbutton.render(
  '.b-topic__sidebar_head span.ticket_toggl:not(.toggl)',
  { observe: true },
  function (elem) {
    const description = function () {
      return $('#extension_data').dataset.description;
    };

    const project = function () {
      return $('#extension_data').dataset.project;
    };

    const tags = function () {
      return ($('#extension_data').dataset.tags || '').split(',').map((tag) => tag.trim());
    };

    const link = togglbutton.createTimerLink({
      className: 'helprace',
      description: description,
      projectName: project,
      tags: tags
    });

    elem.appendChild(link, elem);
  });
