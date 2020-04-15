const browser = require('webextension-polyfill');

class CustomTemplateMessenger {
  customTemplate = "";
  customTemplateMessageName = "";
  useCustomTemplate = false;

  constructor(customTemplateMessageName: string){
    this.customTemplateMessageName = customTemplateMessageName;
  }

  async fetchSettings () {
    await browser.runtime.sendMessage({
      type: this.customTemplateMessageName
    }).then(
      (res) => this.handleResponse(res),
      (err) => this.handleError(err)
    );
  }

  handleError (error: any) {
    console.error('handleError: ', error);
  }

  handleResponse = ({ useCustomTemplate, customTemplate }: CustomTemplateMessage):void => {
    this.useCustomTemplate = useCustomTemplate;
    this.customTemplate = customTemplate;
  }

}

export default CustomTemplateMessenger;
