import browser from 'webextension-polyfill';

import WebsiteBlockingApi from "./WebsiteBlockingApi";

import CurrentlyBlockingListController from "./ui/CurrentlyBlockingListController";
import WellKnownDistractionsController from "./ui/WellKnownDistractionsController";
import ManuallyAddDistractionsController from "./ui/ManuallyAddDistractionsController";

class WebsiteBlocking {
  settings: any
  enabledCheckbox: HTMLElement
  currentlyBlockingListController: CurrentlyBlockingListController
  wellKnownDistractionsController: WellKnownDistractionsController
  manuallyAddDistractionsController: ManuallyAddDistractionsController

  constructor(settings) {
    this.settings = settings;
    this.enabledCheckbox = settings.$websiteBlockingEnabled;
    this.init().catch(WebsiteBlocking.onError);
    this.currentlyBlockingListController = new CurrentlyBlockingListController(settings)
    this.wellKnownDistractionsController = new WellKnownDistractionsController(settings)
    this.manuallyAddDistractionsController = new ManuallyAddDistractionsController(settings)
  }

  async init() {
    const websiteBlockingEnabled = await WebsiteBlocking.db().get('enableWebsiteBlocking');
    this.settings.toggleState(this.enabledCheckbox, websiteBlockingEnabled);

    WebsiteBlockingApi.getWebsiteBlockingRecordsFromApi().then(records => {
      this.settings.saveSetting({records}, 'update-website-blocking-list');
    }).catch(WebsiteBlocking.onError);

    this.enabledCheckbox.addEventListener('click', this.onEnabledCheckboxClick)
    this.currentlyBlockingListController.render().catch(WebsiteBlocking.onError)
    this.wellKnownDistractionsController.render().catch(WebsiteBlocking.onError)
  }

  onEnabledCheckboxClick = async (e) => {
    const enableWebsiteBlocking = await WebsiteBlocking.db().get('enableWebsiteBlocking');
    this.settings.toggleSetting(e.target, !enableWebsiteBlocking, 'update-enable-website-blocking');
  }

  static onError = (e) => {
    browser.runtime.sendMessage({
      type: 'error',
      stack: e.stack,
      category: 'Settings'
    });
  }

  static youShallNotPass(tabId) {
    browser.tabs.update(tabId, {url: browser.runtime.getURL('html/website-blocking.html')})
  }

  static db () {
    return browser.extension.getBackgroundPage().db;
  }

  static async closeOnStart() {
    const websiteBlockingList = JSON.parse(await WebsiteBlocking.db().get('websiteBlockingList') || '[]');
    const blockedSites = websiteBlockingList.map(entry => entry.url);

    if (blockedSites.length > 0) {
      const blockedTabs = await browser.tabs.query({ url: blockedSites });
      blockedTabs.forEach(tab => WebsiteBlocking.youShallNotPass(tab.id));
    }
  };

  static async blockSite(tabId, changeInfo) {
    const url = changeInfo.pendingUrl || changeInfo.url;
    if (!url) {
      return;
    }

    const websiteBlockingEnabled = await WebsiteBlocking.db().get('enableWebsiteBlocking');
    const websiteBlockingList = JSON.parse(await WebsiteBlocking.db().get('websiteBlockingList') || '[]');

    const shouldBlock = websiteBlockingEnabled && !!(websiteBlockingList.find(record => record.url === url));
    let TogglButton = browser.extension.getBackgroundPage().TogglButton;
    if (shouldBlock && TogglButton.$curEntry) {
      WebsiteBlocking.youShallNotPass(tabId);
    }
  };
}

export default WebsiteBlocking;
