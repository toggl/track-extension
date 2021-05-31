import browser from 'webextension-polyfill';

import WebsiteBlockingApi from "./WebsiteBlockingApi";

import BlockingEnabledController from "./ui/BlockingEnabledController";
import CurrentlyBlockingListController from "./ui/CurrentlyBlockingListController";
import WellKnownDistractionsController from "./ui/WellKnownDistractionsController";
import ManuallyAddDistractionsController from "./ui/ManuallyAddDistractionsController";

class WebsiteBlocking {
  settings: any
  blockingEnabledController: BlockingEnabledController
  currentlyBlockingListController: CurrentlyBlockingListController
  wellKnownDistractionsController: WellKnownDistractionsController
  manuallyAddDistractionsController: ManuallyAddDistractionsController

  constructor(settings) {
    this.settings = settings;
    this.blockingEnabledController = new BlockingEnabledController(settings)
    this.currentlyBlockingListController = new CurrentlyBlockingListController(settings)
    this.wellKnownDistractionsController = new WellKnownDistractionsController(settings)
    this.manuallyAddDistractionsController = new ManuallyAddDistractionsController(settings)
    this.init().catch(WebsiteBlocking.onError);
  }

  async init() {
    WebsiteBlockingApi.getWebsiteBlockingRecordsFromApi().then(records => {
      this.settings.saveSetting({records}, 'update-website-blocking-list');
    }).catch(WebsiteBlocking.onError);

    this.currentlyBlockingListController.render().catch(WebsiteBlocking.onError)
    this.wellKnownDistractionsController.render().catch(WebsiteBlocking.onError)
  }

  static onError = (e) => {
    browser.runtime.sendMessage({
      type: 'error',
      stack: e.stack,
      category: 'Settings'
    });
  }

  static youShallNotPass({ id, url }: { id: number, url?: string }) {
    let TogglButton = browser.extension.getBackgroundPage().TogglButton;
    TogglButton.blockedSites[id] = url;
    browser.tabs.update(id, { url: browser.runtime.getURL('html/website-blocking.html') })
  }

  static db () {
    return browser.extension.getBackgroundPage().db;
  }

  static async closeOnStart() {
    const websiteBlockingList = await WebsiteBlocking.db().get('websiteBlockingList');
    const blockedSites = websiteBlockingList.map(entry => entry.url);

    if (blockedSites.length > 0) {
      const blockedTabs = await browser.tabs.query({ url: blockedSites });
      blockedTabs.forEach(tab => WebsiteBlocking.youShallNotPass(tab));
    }
  };

  static async blockSite(tabId, changeInfo) {
    const url = changeInfo.pendingUrl || changeInfo.url;
    if (!url) {
      return;
    }

    const hostname = WebsiteBlocking.getHostnameFromUrl(url);

    const websiteBlockingEnabled = await WebsiteBlocking.db().get('enableWebsiteBlocking');
    const websiteBlockingList = await WebsiteBlocking.db().get('websiteBlockingList');

    const shouldBlock = websiteBlockingEnabled && !!(websiteBlockingList.find(record => {
      return hostname === WebsiteBlocking.getHostnameFromUrl(record.url)
    }));
    let TogglButton = browser.extension.getBackgroundPage().TogglButton;
    setTimeout(() => {
      if (shouldBlock && TogglButton.$curEntry) {
        WebsiteBlocking.youShallNotPass({ id: tabId, url });
      }
    }, 300)
  };

  static getHostnameFromUrl(url: string) {
    const hostname = new URL(url).hostname;
    if (hostname.startsWith('www.')) {
      return hostname.replace('www.', '');
    }
    return hostname;
  }

}

export default WebsiteBlocking;
