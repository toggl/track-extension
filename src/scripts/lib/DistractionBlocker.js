
import browser from 'webextension-polyfill';

export default function DistractionBlocker () {
  const closeOnStart = async () => {
    const blockedTabs = await browser.tabs.query({ url: 'https://www.youtube.com/' });
    blockedTabs.forEach(tab => browser.tabs.remove(tab.id));
  };

  const blockSite = async (tabId, changeInfo, tab) => {
    const url = changeInfo.pendingUrl || changeInfo.url;
    if (!url || !url.startsWith('http')) {
      return;
    }

    let hostname = new URL(url).hostname;
    if (hostname.startsWith('www.')) {
      hostname = hostname.replace('www.', '');
    }

    const websiteBlockingEnabled = await db.get('enableWebsiteBlocking');
    const websiteBlockingList = JSON.parse(await db.get('websiteBlockingList') || '[]');

    const shouldBlock = websiteBlockingEnabled && !!(websiteBlockingList.find(record => record.url === hostname));
    if (shouldBlock && TogglButton.$curEntry) {
      chrome.tabs.remove(tabId);
    }
  };

  return { closeOnStart, blockSite };
};
