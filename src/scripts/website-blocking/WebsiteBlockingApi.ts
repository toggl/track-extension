export default class WebsiteBlockingApi {
  static async getWebsiteBlockingRecordsFromApi() {
    const response = await fetch(`${process.env.API_URL}/v9/me/blocked_sites`, {
      headers: WebsiteBlockingApi._getHeaders(),
    })
    return await response.json()
  }

  static async saveWebsiteBlockingRecordsToApi(entries: WebsiteBlockRecord[]) {
    const body = JSON.stringify(entries)
    const response = await fetch(`${process.env.API_URL}/v9/me/blocked_sites`, {
      method: 'POST',
      headers: WebsiteBlockingApi._getHeaders(),
      body
    })
    return await response.json()
  }

  static async deleteWebsiteBlockingRecord(name: string) {
    return fetch(`${process.env.API_URL}/v9/me/blocked_sites/${name}`, {
      method: 'DELETE',
      headers: WebsiteBlockingApi._getHeaders(),
    })
  }

  static async deleteMultipleWebsiteBlockingRecords(entries: WebsiteBlockRecord[]) {
    return await Promise.all(entries.map(({name}) => {
      return fetch(`${process.env.API_URL}/v9/me/blocked_sites/${name}`, {
        method: 'DELETE',
        headers: WebsiteBlockingApi._getHeaders(),
      })
    }));
  }

  static _getHeaders() {
    const token = localStorage.getItem('userToken') || '';
    return {
      Authorization: `Basic ${btoa(token + ':api_token')}`,
      IsTogglButton: 'true',
    }
  }
}
