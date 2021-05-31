import browser from 'webextension-polyfill';
import WebsiteBlockingApi from "../WebsiteBlockingApi";

const db = browser.extension.getBackgroundPage().db;

export default class CurrentlyBlockingListController {
  settings: any
  container: HTMLElement;
  listContainer: HTMLElement;

  constructor(settings) {
    this.settings = settings;
    this.container = document.getElementById('website-blocking-list-section')!
    this.listContainer = document.getElementById('website-blocking-list-section-currently-blocking')!
    browser.runtime.onMessage.addListener(this.onMessage);
  }

  onMessage = (request) => {
    if (request.type === 'website-blocking-list-updated') {
      this.render()
      if (request.payload && request.payload.scrollListToBottom) {
        setTimeout(() => this.listContainer.scrollTop = this.listContainer.scrollHeight)
      }
    }
  }

  onDelete = async (e) => {
    const name = e.target.dataset.blockingRecordDeleteName;
    const currentRecords = await db.get('websiteBlockingList') || [];
    const url = currentRecords.find(record => record.name === name).url;
    const isSure = window.confirm(`Are you sure you want to unblock ${url}?`);
    if (isSure) {
      try {
        e.target.setAttribute('disabled', 'disabled')
        e.target.classList.add('disabled')
        await WebsiteBlockingApi.deleteWebsiteBlockingRecord(name)
      } catch (e) {
        return;
      } finally {
        e.target.removeAttribute('disabled')
        e.target.classList.remove('disabled')
      }
      const newRecords = currentRecords.filter(record => record.name !== name);
      this.settings.saveSetting({records: newRecords}, 'update-website-blocking-list');
    }
  }

  subscribeToEvents() {
    this.listContainer.querySelectorAll('.website-blocking-list-section-delete button').forEach(button => {
      button.addEventListener('click', this.onDelete)
    })
  }

  render = async () => {
    const currentRecords = (await db.get('websiteBlockingList')) || [];
    if (!currentRecords.length) {
      this.container.classList.add('hidden')
      this.listContainer.innerHTML = ''
      return
    }
    this.container.classList.remove('hidden')
    this.listContainer.innerHTML = currentRecords.map(record => this.renderRecord(record)).join('')
    this.subscribeToEvents();
  }

  renderRecord(record: WebsiteBlockRecord) {
    const {name, url} = record;
    return `
      <div class="website-blocking-list-section-currently-blocking-record">
        <div class="website-blocking-list-section-url">${url}</div>
        <div class="website-blocking-list-section-delete">
          <button data-blocking-record-delete-name="${name}" class="inline-danger">Unblock</button>
        </div>
      </div>
    `
  }
}
