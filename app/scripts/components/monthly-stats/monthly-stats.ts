import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import {StatsService} from '../../services/stats';
import {Subscription} from 'rxjs/Rx';

@Component({
	selector: 'monthly-stats',
	templateUrl: './monthly-stats.html',
})
export class MonthlyStatsComponent implements OnInit, OnDestroy {
	public isLoaded: boolean = false;
	public subscription: Subscription;
	public stats: ITB.Stats;
	@Input() userId: string;
	private dateBias: number = 0;

	constructor(private statsService: StatsService) {
	}

	public ngOnInit() {
		this.subscription = this.statsService.getData(this.userId, this.dateBias)
			.subscribe((stats: ITB.Stats) => {
				this.stats = stats;
				this.isLoaded = true;
			});
	}

	public ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	public onMonthChange($event) {
		this.dateBias = $event.value;
		this.statsService.getData(this.userId, this.dateBias);
	}
}
