import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import {CurrencyPipe} from '@angular/common';
import {ExpensesCalculatorService} from '../../services/expenses-calculator';
import {StatsService} from '../../services/stats';
import {Subscription} from 'rxjs/Rx';
import {BalanceComponent} from './balance/balance';

@Component({
	selector: 'monthly-stats',
	templateUrl: 'scripts/components/monthly-stats/monthly-stats.html',
	providers: [StatsService, ExpensesCalculatorService],
	directives: [BalanceComponent],
	pipes: [CurrencyPipe]
})
export class MonthlyStatsComponent implements OnInit, OnDestroy {
	public isLoaded: boolean = false;
	public subscription: Subscription;
	public stats: ITB.Stats;
	@Input() userId: string;

	constructor(private statsService: StatsService) {
	}

	public ngOnInit() {
		this.subscription = this.statsService.getData(this.userId)
			.subscribe((stats: ITB.Stats) => {
				this.stats = stats;
				this.isLoaded = true;
			});
	}

	public ngOnDestroy() {
		this.subscription.unsubscribe();
	}
}
