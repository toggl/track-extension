export default class WebsiteBlockingConverter {

  static formatRawInput(rawInput: string) {
    return rawInput.split('\n').map(url => url.trim()).filter(Boolean).join('\n')
  }

  static (records: WebsiteBlockRecord[]) {
    return records.map(record => record.url).join('\n')
  }

  static stringToBlockRecords(rawInput: string) {
    const urls = rawInput.split('\n').map(url => url.trim()).filter(Boolean);
    return urls.reduce((acc: WebsiteBlockRecord[], url) => {
      acc.push({
        name: url,
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

  static blockRecordsStringToString(blockRecordsString: string) {
    try {
      const records = JSON.parse(blockRecordsString);
      return WebsiteBlockingConverter.blockRecordsToString(records);
    } catch (e) {
      return '';
    }
  }

  static blockRecordsToString(records: WebsiteBlockRecord[]) {
    return records.map(record => record.url).join('\n')
  }

  static processWebsiteBlockingListInput (rawInput: string) {
    return {
      string: WebsiteBlockingConverter.formatRawInput(rawInput),
      blockRecordsString: WebsiteBlockingConverter.stringToBlockRecordsString(rawInput),
      blockRecords: WebsiteBlockingConverter.stringToBlockRecords(rawInput)
    };
  }
}
