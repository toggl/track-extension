import browser from 'webextension-polyfill';

export async function sendMessage (request: ButtonRequest) {
  if (process.env.DEBUG) {
    console.info('Extension:sendMessage', request);
  }
  const response = await browser.runtime
    .sendMessage(request)
    .catch(error => {
      if (process.env.DEBUG) {
        console.error('Extension:sendMessageResponse', request, error);
      }
    });

  if (!response) {
    return null;
  }
  if (process.env.DEBUG) {
    console.info('Extension:sendMessageResponse', request, response);
  }
  return response as ButtonResponse;
}
