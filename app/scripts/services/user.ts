import {Injectable, Inject} from 'angular2/core';
import {URLSearchParams} from 'angular2/http';
import {Http, Response} from 'angular2/http';
import {ChromeService} from './chrome';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';


@Injectable()
export class UserService {
	public id: number;
	public firstName: string;
	public lastName: string;
	public email: string;
	public cellphone: string;
	public encryptedId: string;


	constructor(@Inject('Configs') private Configs, private chromeService: ChromeService, private http: Http) {
	}

	public isLoggedIn(): Promise<string> {
		return this.chromeService.getCookie('uid', this.Configs.baseUrl);
	};

	public login(userId: string): Observable<any> {
		let search: URLSearchParams = new URLSearchParams();
		search.set('encryptedUserId', userId);
		search.set('shoppingCartGuid', '');
		search.set('WebsiteId', '10bis');
		search.set('DomainId', '10bis');

		let ob = this.http.get(this.Configs.baseUrl + '/api/Login', {search})
			.map((response: Response) => response.json());

		ob.subscribe((response) => {

			console.log(response);
			if (!response.Success) {

			} else {
				return Observable.throw('');
			}
		});
		return ob;
		// return $http.get(this.Configs.baseUrl + '/api/Login', {search}).then(function (response) {
		// 	return (response.data.Success) ? {
		// 		id: response.data.UserData.EncryptedUserId,
		// 		firstName: response.data.UserData.UserFirstName,
		// 		lastName: response.data.UserData.UserLastName
		// 	} : {};
		// });
	}
}
