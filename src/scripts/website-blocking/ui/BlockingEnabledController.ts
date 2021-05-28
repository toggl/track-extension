import browser from 'webextension-polyfill';
import WebsiteBlocking from "../WebsiteBlocking";

const db = browser.extension.getBackgroundPage().db;

export default class BlockingEnabledController {
  settings: any
  enabledCheckbox: HTMLElement

  constructor(settings) {
    this.settings = settings;
    this.enabledCheckbox = settings.$websiteBlockingEnabled;
    this.enabledCheckbox.addEventListener('click', this.onEnabledCheckboxClick)
    this.init().catch(WebsiteBlocking.onError)
  }

  async init() {
    const websiteBlockingEnabled = await db.get('enableWebsiteBlocking');
    this.settings.toggleState(this.enabledCheckbox, websiteBlockingEnabled);
  }

  onEnabledCheckboxClick = async (e) => {
    const enableWebsiteBlocking = await db.get('enableWebsiteBlocking');
    this.settings.toggleSetting(e.target, !enableWebsiteBlocking, 'update-enable-website-blocking');
  }
}
