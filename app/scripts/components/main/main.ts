import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user';
import {ChromeService} from '../../services/chrome';

@Component({
	selector: 'main',
	templateUrl: 'scripts/components/main/main.html',
	providers: [UserService, ChromeService]
})
export class MainComponent implements OnInit {
	public isLoaded: boolean = false;
	public isLoggedIn: boolean = false;
	public user: ITB.User;

	constructor(private userService: UserService) {
	}

	public ngOnInit() {
		this.userService.isLoggedIn()
			.then((cookie) => this.userService.getUserData(cookie))
			.then((user: ITB.User) => {
				this.user = user;

				this.isLoggedIn = true;
				this.isLoaded = true;
			});
	}

	public isUserLoggedIn() {
		return this.isLoggedIn;
	}
}
