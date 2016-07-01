import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user';
import {ChromeService} from '../../services/chrome';
import {MonthlyStatsComponent} from '../monthly-stats/monthly-stats';

@Component({
	selector: 'main',
	templateUrl: 'scripts/components/main/main.html',
	providers: [UserService, ChromeService],
	directives: [MonthlyStatsComponent]
})
export class MainComponent implements OnInit {
	public isLoaded: boolean = false;
	public user: ITB.User;

	constructor(private userService: UserService) {
	}

	public ngOnInit() {
		this.userService.isLoggedIn()
			.then((cookie) => this.userService.getUserData(cookie))
			.then((user: ITB.User) => {
				this.user = user;

				this.isLoaded = true;
			});
	}

	public isLoggedIn(): boolean {
		return !!this.user;
	}
}
