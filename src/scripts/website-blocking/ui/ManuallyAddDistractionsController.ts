import browser from 'webextension-polyfill';
import WebsiteBlockingApi from "../WebsiteBlockingApi";
import WebsiteBlocking from "../WebsiteBlocking";
import WebsiteBlockingConverter from "../WebsiteBlockingConverter";

import {findArrayDuplicates, findArrayIntersection} from '../../lib/utils'

const db = browser.extension.getBackgroundPage().db;

export default class ManuallyAddDistractionsController {
  settings: any
  blockingListTextarea: HTMLTextAreaElement
  blockButton: HTMLButtonElement

  constructor(settings) {
    this.settings = settings;
    this.blockingListTextarea = settings.$websiteBlockingList;
    this.blockButton = <HTMLButtonElement>document.getElementById('website-blocking-list-button');
    this.blockButton.addEventListener('click', this.onAdd);
  }

  onAdd = async (e) => {
    const value = this.blockingListTextarea.value;
    const error = await ManuallyAddDistractionsController.validateWebsiteBlockingListInput(value);
    this.setWebsiteBlockingError(error);
    if (error || !value) {
      return;
    }
    const {blockRecords} = WebsiteBlockingConverter.processWebsiteBlockingListInput(value);
    try {
      e.target.setAttribute('disabled', 'disabled')
      e.target.classList.add('disabled')
      await WebsiteBlockingApi.saveWebsiteBlockingRecordsToApi(blockRecords).catch(WebsiteBlocking.onError);
    } catch (e) {
      return;
    } finally {
      e.target.removeAttribute('disabled')
      e.target.classList.remove('disabled')
    }

    const currentBlockRecords = await db.get('websiteBlockingList');
    const allBlockRecords = [
      ...currentBlockRecords,
      ...blockRecords,
    ];

    this.settings.saveSetting({records: allBlockRecords, scrollListToBottom: true}, 'update-website-blocking-list');
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


  // @ts-ignore
  static async validateWebsiteBlockingListInput(rawInput: string) {
    const currentBlockRecords = await db.get('websiteBlockingList');
    const enteredUrls = WebsiteBlockingConverter.parseRawInput(rawInput);

    const duplicates = findArrayDuplicates(enteredUrls, true);
    if (duplicates.length) {
      return `Duplicates are found: <strong>${duplicates.join(', ')}</strong>. <br/>
              Please, make sure that each URL is unique.`;
    }

    const alreadyBlockedUrls = findArrayIntersection(currentBlockRecords.map(record => record.url), enteredUrls)
    if (alreadyBlockedUrls.length) {
      return `You are already blocking some of the entered URLs: <strong>${alreadyBlockedUrls.join(', ')}</strong>. <br/>
              Please remove them before saving.`;
    }

    const invalidUrls = enteredUrls.filter(url => {
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
}

