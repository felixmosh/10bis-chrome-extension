import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import {ExpensesCalculatorService} from '../../services/expenses-calculator';
import {StatsService} from '../../services/stats';
import {Observable} from 'rxjs/Rx';
import {CurrencyPipe} from '@angular/common';

@Component({
	selector: 'monthly-stats',
	templateUrl: 'scripts/components/monthly-stats/monthly-stats.html',
	providers: [StatsService, ExpensesCalculatorService],
	pipes: [CurrencyPipe]
})
export class MonthlyStatsComponent implements OnInit, OnDestroy {
	public isLoaded: boolean = false;
	public subscription: Observable<ITB.Stats>;
	public stats: ITB.Stats;
	@Input() userId: string;

	constructor(private statsService: StatsService) {
	}

	public ngOnInit() {
		this.statsService.getData(this.userId)
			.subscribe((stats: ITB.Stats) => {
				this.stats = stats;
				this.isLoaded = true;
			});
	}

	public ngOnDestroy() {
		// this.subscription.dispose();
	}
}
