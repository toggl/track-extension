
export default function DistractionBlocker () {
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

  return { blockSite };
};
