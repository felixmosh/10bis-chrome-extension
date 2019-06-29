export class ChromeService {
  public getCookie(name: string, url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      chrome.cookies.get({ name, url }, (cookie: chrome.cookies.Cookie) => {
        if (cookie !== null) {
          resolve(cookie.value);
        } else {
          reject();
        }
      });
    });
  }

  public setItem(key: string, obj: any): Promise<void> {
    return new Promise<void>((resolve) => {
      chrome.storage.local.set({ [key]: obj }, resolve);
    });
  }

  public getItem<T>(key: string): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      chrome.storage.local.get([key], (result) => {
        if (result[key]) {
          resolve(result[key]);
        } else {
          reject(`${key} not found`);
        }
      });
    });
  }

  public async mergeItem(key: string, obj: object): Promise<void> {
    let data;
    try {
      data = await this.getItem(key);
    } catch (e) {
      data = {};
    }

    return this.setItem(key, { ...data, ...obj });
  }

  public setSyncItem<T extends {}>(items: T) {
    return new Promise<void>((resolve) => {
      chrome.storage.sync.set(items, resolve);
    });
  }

  public getSyncItem<T extends {}>(): Promise<T> {
    return new Promise<T>((resolve) => {
      chrome.storage.sync.get(resolve);
    });
  }
}

export const chromeService = new ChromeService();
