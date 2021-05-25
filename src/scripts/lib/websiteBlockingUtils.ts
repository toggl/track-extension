import isValidDomain from 'is-valid-domain';

type WebsiteBlockRecord = {
  id: string;
  url: string;
  androidPackageName: string | null;
  device: 'all' | 'web' | 'android'
}

export function validateWebsiteBlockingListInput (rawInput: string) {
  const hostnames = rawInput.split('\n').map(hostname => hostname.trim()).filter(Boolean);
  const uniqueDomains = [...new Set(hostnames)];
  if (hostnames.length !== uniqueDomains.length) {
    return 'Duplicates are found. Please, make sure that each hostname is unique.';
  }
  const invalidDomains = hostnames.filter(hostname => !isValidDomain(hostname));
  if (invalidDomains.length) {
    return `Invalid hostnames found: ${invalidDomains.join(', ')}.`;
  }
  return null;
}

export function formatRawInput(rawInput: string) {
  return rawInput.split('\n').map(hostname => hostname.trim()).filter(Boolean).join('\n')
}

export function setWebsiteBlockingError(textArea: HTMLElement, error: string | null) {
  const errorElement = textArea.parentElement && textArea.parentElement.querySelector('.error-message');
  if (!errorElement) {
    return;
  }
  if (error) {
    errorElement.innerHTML = error;
    errorElement.classList.remove('hidden');
    return;
  } else {
    errorElement.classList.add('hidden');
    errorElement.innerHTML = '';
  }
}

/*
* Formats:
* String: domain1.com\ndomain2.com - to be used or taken from textarea value
* BlockRecordsString: stringified JSON of WebsiteBlockRecord[] - to be used in API and stored in DB
* BlockRecords - array of WebsiteBlockRecord[]
*/

export function blockRecordsToString(records: WebsiteBlockRecord[]) {
  return records.map(record => record.url).join('\n')
}

export function stringToBlockRecords(rawInput: string) {
  const hostnames = rawInput.split('\n').map(hostname => hostname.trim()).filter(Boolean);
  return hostnames.reduce((acc: WebsiteBlockRecord[], hostname) => {
    acc.push({
      id: hostname,
      url: hostname,
      androidPackageName: null,
      device: 'all'
    });
    return acc;
  }, [])
}

export function stringToBlockRecordsString(rawInput: string) {
  const records = stringToBlockRecords(rawInput);
  return JSON.stringify(records);
}

export function blockRecordsStringToString(blockRecordsString: string) {
  try {
    const records = JSON.parse(blockRecordsString);
    return blockRecordsToString(records);
  } catch (e) {
    return '';
  }
}

export function processWebsiteBlockingListInput (rawInput: string) {
  return {
    asString: formatRawInput(rawInput),
    asBlockRecordsString: stringToBlockRecordsString(rawInput),
    payload: stringToBlockRecords(rawInput)
  };
}

export async function getWebsiteBlockingRecordsFromApi() {
  const token = localStorage.getItem('userToken') || '';
  const response = await fetch(`${process.env.API_URL}/v9/me/blocked_sites`, {
    headers: {
      Authorization: `Basic ${btoa(token + ':api_token')}`,
      IsTogglButton: 'true',
    }
  })
  return await response.json()
}

export async function saveWebsiteBlockingRecordsToApi(body) {
  const token = localStorage.getItem('userToken') || '';
  const response = await fetch(`${process.env.API_URL}/v9/me/blocked_sites`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${btoa(token + ':api_token')}`,
      IsTogglButton: 'true',
    },
    body
  })
  return await response.json()
}
