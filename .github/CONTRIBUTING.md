# Contributing to Toggl Button

Thanks for your interest in contributing to Toggl Button!

Please take a read through these guidelines to make the process as smooth as possible.

## Adding new integrations

For adding a simple integration, the [bitrix24](https://github.com/toggl/toggl-button/blob/master/src/scripts/content/bitrix24.js) integration is a good option for inspiration.

All integrations have some maintenance cost - any time the UI is changed, Toggl Button might break. Help future maintainers by trying to be sensibly "future-proof" with your CSS selectors, following the code style you observe elsewhere and avoiding neat code tricks that others might not understand.

All integrations should be tested across both Chrome and Firefox.

Please consider the following:

* Include screenshot(s) of the working integration in your pull request.
* Include a description of how to find the page or screen the button is visible on.
* Only change or add one integration in each pull request.
* Your code changes will be linted by [eslint](https://eslint.org/) when you attempt to commit. Please fix any errors raised.
  * You may run `npm run lint path/to/your/file/here.js` to lint a file manually. Add `-- --fix` to the command to automatically fix most issues.
* When you're done, squash all of your commits into one commit. This keeps the git log compact and clear.

## Making changes to the core extension code

Please consider future maintainers and the "generic" nature of the extension in mind when writing new features. All changes should be tested across both Chrome and Firefox.

There are a lot of moving parts and different settings in the extension, please do your best to account for them and test that you don't introduce any regressions.
