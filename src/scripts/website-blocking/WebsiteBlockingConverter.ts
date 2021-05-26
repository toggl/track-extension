export default class WebsiteBlockingConverter {

  static formatRawInput(rawInput: string) {
    return rawInput.split('\n').map(hostname => hostname.trim()).filter(Boolean).join('\n')
  }

  static (records: WebsiteBlockRecord[]) {
    return records.map(record => record.url).join('\n')
  }

  static stringToBlockRecords(rawInput: string) {
    const hostnames = rawInput.split('\n').map(hostname => hostname.trim()).filter(Boolean);
    return hostnames.reduce((acc: WebsiteBlockRecord[], hostname) => {
      acc.push({
        name: hostname,
        url: hostname,
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
