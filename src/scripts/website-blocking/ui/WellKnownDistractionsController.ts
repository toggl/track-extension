import browser from 'webextension-polyfill';
import wellKnownDistractions from '../WellKnownDistractions';
import WebsiteBlockingApi from "../WebsiteBlockingApi";
import WebsiteBlocking from "../WebsiteBlocking";

const db = browser.extension.getBackgroundPage().db;

export default class WellKnownDistractionsController {
  settings: any
  container: HTMLElement;
  select: HTMLSelectElement;
  blockButton: HTMLButtonElement;

  constructor(settings) {
    this.settings = settings;
    this.container = document.getElementById('website-blocking-known-distractions-section')!
    this.select = <HTMLSelectElement>document.getElementById('well-known-distractions')!
    this.blockButton = <HTMLButtonElement>document.getElementById('block-well-known-distraction-button')!
    this.blockButton.addEventListener('click', this.onAdd)
    browser.runtime.onMessage.addListener(this.onMessage);
  }

  onMessage = (request) => {
    if (request.type === 'website-blocking-list-updated') {
      this.render()
    }
  }

  onAdd = async (e) => {
    const currentRecords = await db.get('websiteBlockingList') || [];
    const value = this.select.value;
    const blockingRecord = <WebsiteBlockRecord>wellKnownDistractions.find(record => record.name === value)!;

    try {
      e.target.setAttribute('disabled', 'disabled')
      e.target.classList.add('disabled')
      await WebsiteBlockingApi.saveWebsiteBlockingRecordsToApi([blockingRecord])
        .catch(WebsiteBlocking.onError);
    } catch (e) {
      return;
    } finally {
      e.target.removeAttribute('disabled')
      e.target.classList.remove('disabled')
    }

    const allBlockRecords = [
      ...currentRecords,
      blockingRecord,
    ];
    this.settings.saveSetting({records: allBlockRecords, scrollListToBottom: true}, 'update-website-blocking-list');
  }

  render = async () => {
    this.select.innerHTML = '';
    const currentRecords = await db.get('websiteBlockingList') || [];
    const availableDistractions = wellKnownDistractions.filter(distraction => {
      return !currentRecords.find(currentRecord => currentRecord.name === distraction.name || currentRecord.url === distraction.url)
    })
    if (availableDistractions.length) {
      this.container.classList.remove('hidden')
      availableDistractions.forEach((distraction, i) => {
        const option = document.createElement('option');
        option.id = distraction.name;
        option.value = distraction.name;
        option.textContent = distraction.name;
        this.select.appendChild(option);
        if (i === 0) {
          this.select.value = option.value;
        }
      })
    } else {
      this.container.classList.add('hidden')
    }
  }
}
