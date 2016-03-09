# Toggl Button Chrome extension

Add Toggl one-click time tracking to popular web tools.

## Compatible services
  - [TeamWeek][2]
  - [Pivotal tracker][3]
  - [Github][4]
  - [Asana][5]
  - [Unfuddle][6]
  - [Gitlab][7]
  - [Trello][8]
  - [Worksection][9]
  - [Redbooth (old UI)][10]
  - [Podio][11]
  - [Basecamp][12]
  - [JIRA (InCloud)][13]
  - [Producteev][14]
  - [Bitbucket][15]
  - [Sifter][16]
  - [Google Docs][17]
  - [Redmine][18]
  - [YouTrack (InCloud)][19]
  - [CapsuleCRM][20]
  - [Xero][21]
  - [Zendesk][22]
  - [Any.do][23]
  - [Todoist][24]
  - [Trac][25]
  - [Wunderlist][26]
  - [Toodledo][27]
  - [Teamwork.com][28]
  - [Google Mail][29]
  - [Taiga][30]
  - [HabitRPG][31]
  - [Axosoft][32]
  - [Countersoft Gemini][33]
  - [Drupal][34]
  - [Esa][35]
  - [Help Scout][36]
  - [Flow][37]
  - [Sprintly][38]
  - [Google Calendar][39]
  - [TestRail][40]
  - [Bugzilla][41]
  - [Breeze][42]
  - [BamBam][43]
  - [GQueue][44]
  - [Wrike][45]
  - [Assembla][46]
  - [Waffle][47]
  - [Codeable][48]
  - [Eventum][49]
  - [Salesforce][50]
  - [Draftin][51]
  - [FogBugz][52]
  - [Google Keep][53]
  - [Gingko][54]
  - [Google Inbox][55]
  - [Wordpress][56]
  - [Kanbanery][57]
  - [Planbox][58]
  - [Zoho Books][59]
  - [Slack][60]
  - [Doit.im][61]
  - [Sunrise Calendar][62]
  - [Cloudes][63]
  - [eProject.me][64]
  - [Freshdesk][65]
  - [Newsletter2Go][66]
  - [Gogs][67]
  - [DevDocs][68]
  - [LiquidPlanner][69]
  - [SourceLair][70]
  - [Remember The Milk][71]
  - [Evernote][72]
  - [MantisHub][73]

## Installing from the Web Store

https://chrome.google.com/webstore/detail/toggl-button/oejgccbfbmkkpaidnkphaiaecficdnfn

## Installing from Source

1.  Clone the repository: `git clone git://github.com/toggl/toggl-button`
2.  Navigate to `chrome://extensions/` and enable "Developer Mode".
3.  Choose "Load unpacked extension..."
4.  Open the src directory in the toggl-button directory you just cloned and follow the prompts to install.

## Change log

List of all the changes and added features can be found at http://toggl.github.io/toggl-button

## Using the Button
1.  Log in to your [Toggl][1] account and keep yourself logged in (no need to keep the tab open).
2.  Go to your [TeamWeek][2], [Pivotal Tracker][3], [Github][4], [Asana][5], [Unfuddle][6], [Gitlab][7],
[Trello][8], [Worksection][9], [Redbooth][10], [Podio][11], [Basecamp][12], [JIRA][13], [Producteev][14],
[Bitbucket][15], [Stifer][16], [Google Docs][17], [Redmine][18], [YouTrack][19], [CapsuleCRM][20],
[Xero][21], [Zendesk][22], [Any.do][23], [Todoist][24], [Trac][25], [Wunderlist][26], [Toodledo][27], [Teamwork.com][28], [Google Mail][29], [Taiga][30], [HabitRPG][31], [Axosoft][32], [Countersoft Gemini][33], [Drupal][34], [Esa][35], [Help Scout][36], [Flow][37], [Sprintly][38], [Google Calendar][39], [TestRail][40], [Bugzilla][41], [Breeze][42], [BamBam][43], [GQueue][44], [Wrike][45], [Assembla][46], [Waffle][47], [Codeable][48], [Eventum][49], [Salesforce][50], [Draftin][51], [FogBugz][52], [Google Keep][53], [Gingko][54], [Google Inbox][55], [Wordpress][56], [Kanbanery][57], [Planbox][58], [Zoho Books][59], [Slack][60], [Doit.im][61], [Sunrise Calendar][62], [Cloudes][63], [eProject.me][64], [Freshdesk][65], [Newsletter2Go][66], [Gogs][67], [DevDocs][68], [LiquidPlanner][69], [SourceLair][70], [Remember The Milk][71], [Evernote][72], [MantisHub][73] account and start your Toggl timer there.

Or start entry from the extension icon menu

3. To edit the running time entry
  - Edit entry details from the post start popup that is shown right after you click the "Start timer" button
  - Edit entry details from the extesnion icon menu by clicking the running duration

4. To stop the current running timer:
  - Press the button again
  - Stop the entry from the extension icon menu
  - Start another time entry inside your account.
  - Go to Toggl to stop or edit your time entry.

## Custom domains
If you use a setup, where one of the supported services is on a custom domain you can customize the extension to fit your needs. Here is a step by step guide on how to [add custom domain][98] to the extension.

## Contributing
Want to contribute? Great! Just fork the project, make your changes and open a [Pull Request][99]

When adding new integrations please use `git squash` and merge all your commits into one commit. This keeps the git log more compact and clear.

Don't know how to start? Just check out the [user requested services][97] that have not yet been implemented, pick one and start hacking.

[1]: https://www.toggl.com/
[2]: https://teamweek.com/
[3]: https://www.pivotaltracker.com/
[4]: https://github.com/
[5]: http://asana.com/
[6]: http://unfuddle.com/
[7]: https://gitlab.com/
[8]: https://trello.com/
[9]: http://worksection.com/
[10]: https://redbooth.com/
[11]: https://podio.com/
[12]: https://basecamp.com/
[13]: https://www.atlassian.com/software/jira
[14]: https://www.producteev.com/
[15]: https://www.bitbucket.org/
[16]: https://www.sifterapp.com/
[17]: https://docs.google.com/
[18]: http://www.redmine.org/
[19]: http://www.jetbrains.com/youtrack/
[20]: http://www.capsulecrm.com/
[21]: https://www.xero.com/
[22]: https://www.zendesk.com/
[23]: http://www.any.do/
[24]: https://todoist.com/
[25]: http://trac.edgewall.org/
[26]: https://www.wunderlist.com
[27]: https://www.toodledo.com/
[28]: https://www.teamwork.com/
[29]: https://mail.google.com
[30]: https://taiga.io/
[31]: https://habitrpg.com
[32]: https://www.axosoft.com
[33]: https://www.countersoft.com
[34]: https://www.drupal.org
[35]: https://esa.io
[36]: http://www.helpscout.net/
[37]: http://getflow.com/
[38]: https://sprint.ly
[39]: https://www.google.com/calendar
[40]: https://testrail.com
[41]: https://bugzilla.mozilla.org/
[42]: http://www.breeze.pm/
[43]: https://www.dobambam.com/
[44]: https://www.gqueues.com/
[45]: https://www.wrike.com/
[46]: https://www.assembla.com/
[47]: https://waffle.io/
[48]: https://www.codeable.io/
[49]: https://launchpad.net/eventum
[50]: http://www.salesforce.com/
[51]: https://draftin.com/
[52]: http://www.fogcreek.com/fogbugz/
[53]: https://keep.google.com/
[54]: https://gingkoapp.com/
[55]: https://inbox.google.com
[56]: https://wordpress.com
[57]: https://www.kanbanery.com/
[58]: http://www.planbox.com/
[59]: https://books.zoho.com/
[60]: https://slack.com/
[61]: https://i.doit.im/
[62]: https://calendar.sunrise.am
[63]: http://cloudes.me/
[64]: https://eproject.me/
[65]: https://www.freshdesk.com/
[66]: http://www.newsletter2go.com/
[67]: http://gogs.io/
[68]: http://devdocs.io/
[69]: https://www.liquidplanner.com/
[70]: https://www.sourcelair.com/
[71]: https://www.rememberthemilk.com/
[72]: https://www.evernote.com/
[73]: http://www.mantishub.com/

[97]: https://github.com/toggl/toggl-button/wiki/User-requested-buttons
[98]: https://github.com/toggl/toggl-button/wiki/Adding-custom-domains
[99]: https://github.com/toggl/toggl-button/pulls
