import browser from 'webextension-polyfill';

import WebsiteBlockingApi from "./WebsiteBlockingApi";
import WebsiteBlockingConverter from "./WebsiteBlockingConverter";

class WebsiteBlocking {
  settings: any
  db: {get: Function, set: Function}
  enabledCheckbox: HTMLElement
  blockingListTextarea: HTMLTextAreaElement

  constructor(Settings) {
    this.settings = Settings;

    this.enabledCheckbox = Settings.$websiteBlockingEnabled;
    this.blockingListTextarea = Settings.$websiteBlockingList;
    this.init().catch(this.onError);
  }

  async init() {
    const websiteBlockingEnabled = await WebsiteBlocking.db().get('enableWebsiteBlocking');
    const websiteBlockingList = await WebsiteBlocking.db().get('websiteBlockingList');
    this.settings.toggleState(this.enabledCheckbox, websiteBlockingEnabled);
    this.blockingListTextarea.value = WebsiteBlockingConverter.blockRecordsStringToString(websiteBlockingList);

    WebsiteBlockingApi.getWebsiteBlockingRecordsFromApi().then(records => {
      this.blockingListTextarea.value = WebsiteBlockingConverter.blockRecordsToString(records);
      this.settings.saveSetting(JSON.stringify(records), 'update-website-blocking-list');
    }).catch(this.onError);

    this.enabledCheckbox.addEventListener('click', this.onEnabledCheckboxClick)
    this.blockingListTextarea.addEventListener('blur', this.onBlockingListTextareaBlur)
    this.currentlyBlockingListController.render().catch(this.onError)
  }

   onEnabledCheckboxClick = async (e) => {
    const enableWebsiteBlocking = await WebsiteBlocking.db().get('enableWebsiteBlocking');
    this.settings.toggleSetting(e.target, !enableWebsiteBlocking, 'update-enable-website-blocking');
  }

  onBlockingListTextareaBlur = async (e) => {
    const error = await WebsiteBlocking.validateWebsiteBlockingListInput(e.target.value);
    this.setWebsiteBlockingError(error);
    if (error || !e.target.value) {
      return;
    }

    const currentBlockRecords = await WebsiteBlocking.db().get('websiteBlockingList');
    const { blockRecordsString, blockRecords } = WebsiteBlockingConverter.processWebsiteBlockingListInput(e.target.value);

    if (JSON.stringify(currentBlockRecords) === blockRecordsString) {
      return;
    }

    const blockRecordsToAdd = blockRecords.filter(newRecord => {
      return !Boolean(currentBlockRecords.find(currentRecord => currentRecord.name === newRecord.name))
    })
    if (blockRecordsToAdd.length) {
      WebsiteBlockingApi.saveWebsiteBlockingRecordsToApi(blockRecordsToAdd).catch(this.onError);
    }

    const allBlockRecords = [
      ...currentBlockRecords,
      ...blockRecords,
    ];

    this.settings.saveSetting(allBlockRecords, 'update-website-blocking-list');
    this.blockingListTextarea.value = '';
  }

  setWebsiteBlockingError(error: string | null) {
    const errorElement = this.blockingListTextarea.parentElement &&
      this.blockingListTextarea.parentElement.querySelector('.error-message');
    if (!errorElement) {
      return;
    }
    if (error) {
      errorElement.innerHTML = error;
      errorElement.classList.remove('hidden');
      return;
    } else {
      errorElement.classList.add('hidden');
      errorElement.innerHTML = '';
    }
  }

  onError = (e) => {
    browser.runtime.sendMessage({
      type: 'error',
      stack: e.stack,
      category: 'Settings'
    });
  }

  static async validateWebsiteBlockingListInput(rawInput: string) {
    const currentBlockRecords = await db.get('websiteBlockingList');
    const urls = [
      ...currentBlockRecords.map(record => record.url),
      ...rawInput.split('\n').map(url => url.trim()).filter(Boolean)
    ];
    const uniqueUrls = [...new Set(urls)];
    if (urls.length !== uniqueUrls.length) {
      return 'Duplicates are found. Please, make sure that each URL is unique.';
    }
    const invalidUrls = urls.filter(url => {
      try {
        new URL(url);
        return false;
      } catch {
        return true;
      }
    });
    if (invalidUrls.length) {
      return `Invalid URL(s) found: ${invalidUrls.join(', ')}. <br />
      Make sure all your URLs are formatted like "https://example.com"`;
    }
    return null;
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

  static youShallNotPass(tabId) {
    browser.tabs.update(tabId, {url: browser.runtime.getURL('html/website-blocking.html')})
  }

  static db () {
    return browser.extension.getBackgroundPage().db;
  }
}

export default WebsiteBlocking;
