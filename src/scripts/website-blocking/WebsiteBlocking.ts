import browser from 'webextension-polyfill';

import WebsiteBlockingApi from "./WebsiteBlockingApi";
import WebsiteBlockingConverter from "./WebsiteBlockingConverter";

const db = () => browser.extension.getBackgroundPage().db;

function youShallNotPass(tabId) {
  browser.tabs.update(tabId, {url: browser.runtime.getURL('html/website-blocking.html')})
}

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
    const websiteBlockingEnabled = await db().get('enableWebsiteBlocking');
    const websiteBlockingList = await db().get('websiteBlockingList');
    this.settings.toggleState(this.enabledCheckbox, websiteBlockingEnabled);
    this.blockingListTextarea.value = WebsiteBlockingConverter.blockRecordsStringToString(websiteBlockingList);

    WebsiteBlockingApi.getWebsiteBlockingRecordsFromApi().then(records => {
      this.blockingListTextarea.value = WebsiteBlockingConverter.blockRecordsToString(records);
      this.settings.saveSetting(JSON.stringify(records), 'update-website-blocking-list');
    }).catch(this.onError);

    this.enabledCheckbox.addEventListener('click', this.onEnabledCheckboxClick)
    this.blockingListTextarea.addEventListener('blur', this.onBlockingListTextareaBlur)
  }

   onEnabledCheckboxClick = async (e) => {
    const enableWebsiteBlocking = await db().get('enableWebsiteBlocking');
    this.settings.toggleSetting(e.target, !enableWebsiteBlocking, 'update-enable-website-blocking');
  }

  onBlockingListTextareaBlur = async (e) => {
    const error = WebsiteBlocking.validateWebsiteBlockingListInput(e.target.value);
    this.setWebsiteBlockingError(error);
    if (error) {
      return;
    }

    const currentValue = await db().get('websiteBlockingList');
    const { string, blockRecordsString, blockRecords } = WebsiteBlockingConverter.processWebsiteBlockingListInput(e.target.value);

    if (currentValue === blockRecordsString) {
      return;
    }

    const currentBlockRecords = JSON.parse(currentValue) || [];

    const entriesToAdd = blockRecords.filter(newRecord => {
      return !Boolean(currentBlockRecords.find(currentRecord => currentRecord.name === newRecord.name))
    })
    if (entriesToAdd.length) {
      WebsiteBlockingApi.saveWebsiteBlockingRecordsToApi(entriesToAdd).catch(this.onError);
    }

    const entriesToRemove = currentBlockRecords.filter(currentRecord => {
      return !Boolean(blockRecords.find(newRecord => newRecord.name === currentRecord.name))
    })
    if (entriesToRemove.length) {
      WebsiteBlockingApi.deleteWebsiteBlockingRecords(entriesToRemove).catch(this.onError);
    }

    this.settings.saveSetting(blockRecordsString, 'update-website-blocking-list');
    this.blockingListTextarea.value = string;
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

  static validateWebsiteBlockingListInput (rawInput: string) {
    const urls = rawInput.split('\n').map(url => url.trim()).filter(Boolean);
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
    
    const websiteBlockingList = JSON.parse(await db().get('websiteBlockingList') || '[]');

    const blockedSites = websiteBlockingList.map(entry => entry.url);

    console.log(blockedSites)
    if (blockedSites.length > 0) {
      const blockedTabs = await browser.tabs.query({ url: blockedSites });
      blockedTabs.forEach(tab => youShallNotPass(tab.id));
    }
  };

  static async blockSite(tabId, changeInfo) {
    const url = changeInfo.pendingUrl || changeInfo.url;
    
  
    const websiteBlockingEnabled = await db().get('enableWebsiteBlocking');
    const websiteBlockingList = JSON.parse(await db().get('websiteBlockingList') || '[]');

    const shouldBlock = websiteBlockingEnabled && !!(websiteBlockingList.find(record => record.url === url));
    let TogglButton = browser.extension.getBackgroundPage().TogglButton;
    if (shouldBlock && TogglButton.$curEntry) {
      youShallNotPass(tabId)
    }
  };
}

export default WebsiteBlocking;
