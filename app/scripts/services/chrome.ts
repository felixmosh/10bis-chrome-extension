import {Injectable} from 'angular2/core';

@Injectable()
export class ChromeService {
	constructor() {
	}

	public getCookie(name: string, url: string): Promise<string> {
		return new Promise((resolve, reject) => {
			chrome.cookies.get({name, url}, function (cookie: chrome.cookies.Cookie) {
				if (cookie !== null) {
					resolve(cookie.value);
				} else {
					reject();
				}
			});
		});
	}
}
