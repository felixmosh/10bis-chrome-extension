import {Injectable, Inject} from '@angular/core';
import {URLSearchParams} from '@angular/http';
import {Http, Response} from '@angular/http';
import {ChromeService} from './chrome';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';


@Injectable()
export class UserService {
	private user: Promise<ITB.User>;

	constructor(@Inject('Configs') private Configs, private chromeService: ChromeService, private http: Http) {
	}

	public isLoggedIn(): Promise<string> {
		return this.chromeService.getCookie('uid', this.Configs.baseUrl);
	};

	public getUserData(userId: string): Promise<ITB.User> {

		if (!this.user) {
			let search: URLSearchParams = new URLSearchParams();
			search.set('encryptedUserId', userId);
			search.set('shoppingCartGuid', '');
			search.set('WebsiteId', '10bis');
			search.set('DomainId', '10bis');

			this.user = this.http.get(this.Configs.baseUrl + '/api/Login', {search})
				.map((response: Response) => response.json())
				.toPromise()
				.then((response: ITB.Response.Login) => {
					if (response.Success) {
						return <ITB.User>{
							id: response.UserData.UserId,
							firstName: response.UserData.UserFirstName,
							lastName: response.UserData.UserLastName,
							email: response.UserData.UserEmail,
							cellphone: response.UserData.Cellphone,
							encryptedId: response.UserData.EncryptedUserId
						};
					}
				});
		}
		
		return this.user;
		// return $http.get(this.Configs.baseUrl + '/api/Login', {search}).then(function (response) {
		// 	return (response.data.Success) ? {
		// 		id: response.data.UserData.EncryptedUserId,
		// 		firstName: response.data.UserData.UserFirstName,
		// 		lastName: response.data.UserData.UserLastName
		// 	} : {};
		// });
	}
}
