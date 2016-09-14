import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user';
import {ChromeService} from '../../services/chrome';
import {StatsService} from '../../services/stats';
import {ExpensesCalculatorService} from '../../services/expenses-calculator';
require('./ten-bis.scss');

@Component({
	selector: 'ten-bis',
	templateUrl: './ten-bis.html',
	providers: [UserService, ChromeService, StatsService, ExpensesCalculatorService]
})
export class TenBisComponent implements OnInit {
	public isLoaded: boolean = false;
	public user: ITB.User;

	constructor(private userService: UserService) {
	}

	public ngOnInit() {
		this.userService.isLoggedIn()
			.then((cookie) => this.userService.getUserData(cookie))
			.then((user: ITB.User) => {
				this.user = user;
			}).catch(() => this.user = null)
			.then(() => this.isLoaded = true);
	}

	public isLoggedIn(): boolean {
		return !!this.user;
	}
}
