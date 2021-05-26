import isValidDomain from 'is-valid-domain';
import browser from 'webextension-polyfill';

import WebsiteBlockingApi from "./WebsiteBlockingApi";
import WebsiteBlockingConverter from "./WebsiteBlockingConverter";

class WebsiteBlocking {
  settings: any
  db: {get: Function, set: Function}
  enabledCheckbox: HTMLElement
  blockingListTextarea: HTMLTextAreaElement

  constructor(Settings, db) {
    this.settings = Settings;
    this.db = db;

    this.enabledCheckbox = Settings.$websiteBlockingEnabled;
    this.blockingListTextarea = Settings.$websiteBlockingList;
    this.init().catch(this.onError);
  }

  async init() {
    const websiteBlockingEnabled = await this.db.get('enableWebsiteBlocking');
    const websiteBlockingList = await this.db.get('websiteBlockingList');
    this.settings.toggleState(this.enabledCheckbox, websiteBlockingEnabled);
    this.blockingListTextarea.value = WebsiteBlockingConverter.blockRecordsStringToString(websiteBlockingList);

    WebsiteBlockingApi.getWebsiteBlockingRecordsFromApi().then(records => {
      this.settings.$websiteBlockingList.value = WebsiteBlockingConverter.blockRecordsToString(records);
      this.settings.saveSetting(JSON.stringify(records), 'update-website-blocking-list');
    }).catch(this.onError);

    this.enabledCheckbox.addEventListener('click', this.onEnabledCheckboxClick)
    this.blockingListTextarea.addEventListener('blur', this.onBlockingListTextareaBlur)
  }

   onEnabledCheckboxClick = async (e) => {
    const enableWebsiteBlocking = await this.db.get('enableWebsiteBlocking');
    this.settings.toggleSetting(e.target, !enableWebsiteBlocking, 'update-enable-website-blocking');
  }

  onBlockingListTextareaBlur = async (e) => {
    const error = WebsiteBlocking.validateWebsiteBlockingListInput(e.target.value);
    this.setWebsiteBlockingError(error);
    if (error) {
      return;
    }

    const currentValue = await this.db.get('websiteBlockingList');
    const { string, blockRecordsString, blockRecords } = WebsiteBlockingConverter.processWebsiteBlockingListInput(e.target.value);

    if (currentValue === blockRecordsString) {
      return;
    }

    const currentBlockRecords = JSON.parse(currentValue);

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
    const hostnames = rawInput.split('\n').map(hostname => hostname.trim()).filter(Boolean);
    const uniqueDomains = [...new Set(hostnames)];
    if (hostnames.length !== uniqueDomains.length) {
      return 'Duplicates are found. Please, make sure that each hostname is unique.';
    }
    const invalidDomains = hostnames.filter(hostname => !isValidDomain(hostname));
    if (invalidDomains.length) {
      return `Invalid hostnames found: ${invalidDomains.join(', ')}.`;
    }
    return null;
  }
}

export default WebsiteBlocking;


