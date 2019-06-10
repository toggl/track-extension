import nanoid from 'nanoid';

const GA_KEY = 'GA:clientID';
let clientId = localStorage.getItem(GA_KEY);

export default class Ga {
  constructor (db) {
    this.db = db;

    this.load();
  }

  load () {
    if (!clientId) {
      clientId = nanoid();
      localStorage.setItem(GA_KEY, clientId);
    }
  }

  report (event, service) {
    this.db.get('sendUsageStatistics')
      .then((sendUsageStatistics) => {
        if (sendUsageStatistics) {
          const request = new XMLHttpRequest();
          const message =
            'v=1&tid=' +
            process.env.GA_TRACKING_ID +
            '&cid=' +
            clientId +
            '&aip=1' +
            '&ds=extension&t=event&ec=' +
            event +
            '&ea=' +
            service;

          request.open('POST', 'https://www.google-analytics.com/collect', true);
          request.send(message);
        }
      });
  }

  reportEvent (event, service) {
    this.report(event, event + '-' + service);
  }

  reportOs () {
    chrome.runtime.getPlatformInfo((info) => {
      this.report('os', 'os-' + info.os);
    });
  }

  reportSettings (event, service) {

  }
}
