import browser from 'webextension-polyfill';

class Sound {
  static async instance(file: string, volume: number, loop: boolean = false) {
    const context = new AudioContext();
    const gainNode = context.createGain();
    const source = context.createBufferSource();
    gainNode.gain.value = volume;
    gainNode.connect(context.destination);
    source.connect(gainNode);
    source.loop = loop;
    source.buffer = await new Promise(async (resolve, reject) => {
      let content = await Sound.getAudioBuffer(file);
      context.decodeAudioData(content, buffer => resolve(buffer), error => reject(error));
    });

    return {
      play: () => source.start(0),
      stop: () => {
        source.stop(0);
        return context.close();
      }
    }
  }

  static async getAudioBuffer(file: string) {
    let url = browser.runtime.getURL(file);
    let response = await fetch(url);
    return await response.arrayBuffer();
  }
}

export default Sound;
