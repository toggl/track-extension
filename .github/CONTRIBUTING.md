# Contributing to Toggl Button

Thanks for your interest in contributing to Toggl Button!

Please take a read through these guidelines to make the process as smooth as possible.

## Adding new integrations

For adding a simple integration, the [bitrix24](https://github.com/toggl/toggl-button/blob/master/src/scripts/content/bitrix24.js) integration is a good option for inspiration.

All integrations have some maintenance cost - any time the UI is changed, Toggl Button might break. Help future maintainers by trying to be sensibly "future-proof" with your CSS selectors, following the code style you observe elsewhere and avoiding neat code tricks that others might not understand.

All integrations should be tested across both Chrome and Firefox.

Please consider the following with your pull request:

* Include screenshot(s) of the working integration in your pull request.
* Include a description of how to find the page or screen the button is visible on.
* Only change or add one integration in each pull request.
* Your code changes will be linted by [eslint](https://eslint.org/) when you attempt to commit. Please fix any errors raised.
  * You may run `npm run lint path/to/your/file/here.js` to lint a file manually. Add `-- --fix` to the command to automatically fix most issues.
* When you're done, squash all of your commits into one commit. This keeps the git log compact and clear.

#### Toggl Button "style guide":

**For integrations that show one button on the page:**
* Use the default appearance

![](https://user-images.githubusercontent.com/6432028/54681194-ac58da00-4b03-11e9-8e69-8341d4b786b9.png).

* If the button is placed in a tight spot (such as a toolbar), you can use `buttonType: minimal`.
* It's OK for the "Start/stop timer" text color to be changed to fit the integration.
* You can place the button inside a UI component if it makes sense. Example: Trello

![](https://user-images.githubusercontent.com/6432028/54681196-af53ca80-4b03-11e9-8510-5af04f714907.png)

**For integrations that show many buttons in a list:**
* Always use `buttonType: minimal`.
* The buttons must *only* be shown on **hover** or in context menus.
* Buttons must use the grey icon. ![]()
* When a timer is active, the active button must be shown all the time (instead of only on hover).
* Active buttons must use the red icon. ![]()
* Please investigate performance. List integrations can have a negative effect.

![](https://user-images.githubusercontent.com/6432028/54681215-b8dd3280-4b03-11e9-8bf9-c75712b655b2.png)

>See the [Microsoft To-Do](https://github.com/toggl/toggl-button/blob/master/src/scripts/content/microsoft-to-do.js) integration for reference.

**All buttons:**
* Make sure we're not leaking styles or breaking the layout of the UI.
* The text used as timer description should be tailored to the majority of users. E.g. if ticket ID is an important piece of information, it should be included. If it's not important information (e.g. never actually shown in the UI, only in URLs) it should not be included.

### Private integration

If you want to integrate `Toggl Button` with your private project on your custom domain you can
assign the domain to `Generic Toggl` integration in settings "Permissions" tab.

Your site needs to contain some variation of the following HTML element, where the Toggl Button will
be created as its child:

```html
<div
  class="toggl-root"
  data-class-name="name-of-the-integration"
  data-description="Description of a new entry"
  data-project-id="ID of a project that the entry should be assigned to"
  data-project-name="Name of a project that the entry should be assigned to"
  data-tags="list,of,tags"
  data-type="minimal"
></div>
```

## Making changes to the core extension code

Please consider future maintainers and the "generic" nature of the extension in mind when writing new features. All changes should be tested across both Chrome and Firefox.

There are a lot of moving parts and different settings in the extension, please do your best to account for them and test that you don't introduce any regressions.

## Commit Message Guidelines

We use [conventional commit messages](https://www.conventionalcommits.org/en/v1.0.0-beta.3/#summary)

This leads to **more
readable messages** and we use the git commit messages to **generate the changelog and trigger new releases**.

### Commit Message Format
Each commit message consists of a **header**, a **body** and a **footer**.  The header has a special
format that includes a **type**, a **scope** and a **subject**:

```
<type>[optional scope]: <description>

[optional body]

[optional footer]
```

The **header** is mandatory and the **scope** of the header is optional.

Any line of the commit message cannot be longer 100 characters! This allows the message to be easier
to read on GitHub as well as in various git tools.

The footer should contain a [closing reference to an issue](https://help.github.com/articles/closing-issues-via-commit-messages/) if any.

Samples:

```
feat: Add some-new integration
```
```
fix(trello):Trello integration

- Update selectors

closes #4
```
```
fix: Github project integration
```

### Type
Must be one of the following:

* **build**: Changes that affect the build system or external dependencies (example scopes: webpack, npm)
* **ci**: Changes to our CI configuration files and scripts
* **docs**: Documentation only changes
* **feat**: A new feature/integration
* **fix**: A bug fix
* **perf**: A code change that improves performance
* **refactor**: A code change that neither fixes a bug nor adds a feature
* **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
* **test**: Adding missing tests or correcting existing tests
