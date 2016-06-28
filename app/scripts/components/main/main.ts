import {Component} from 'angular2/core';
import {HTTP_PROVIDERS} from 'angular2/http';
import {UserService} from '../../services/user';
import {ChromeService} from '../../services/chrome';

@Component({
	selector: 'main',
	templateUrl: 'scripts/components/main/main.html',
	providers: [HTTP_PROVIDERS, UserService, ChromeService]
})
export class MainComponent {
	public isLoaded: boolean = false;

	constructor(private userService: UserService) {

		this.userService.isLoggedIn()
			.then((cookie) => {
				this.userService.login(cookie);
			});
	}

	public isUserLoggedIn() {
		return true;
	}
}
