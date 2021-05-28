export default class WebsiteBlockingConverter {

  static parseRawInput(rawInput: string) {
    return rawInput.split('\n')
      .map(url => url.trim())
      .filter(Boolean)
      .map(url => !url.endsWith('/') ? url + '/' : url)
  }

  static (records: WebsiteBlockRecord[]) {
    return records.map(record => record.url).join('\n')
  }

  static stringToBlockRecords(rawInput: string) {
    const urls = WebsiteBlockingConverter.parseRawInput(rawInput);
    return urls.reduce((acc: WebsiteBlockRecord[], url) => {
      acc.push({
        name: `${url.replace(/[\W]+/g,"_")}_${Date.now()}`,
        url: url,
        device: 'all'
      });
      return acc;
    }, [])
  }

  static stringToBlockRecordsString(rawInput: string) {
    const records = WebsiteBlockingConverter.stringToBlockRecords(rawInput);
    return JSON.stringify(records);
  }

  static processWebsiteBlockingListInput (rawInput: string) {
    return {
      blockRecordsString: WebsiteBlockingConverter.stringToBlockRecordsString(rawInput),
      blockRecords: WebsiteBlockingConverter.stringToBlockRecords(rawInput)
    };
  }
}
