import {Component, OnInit, Input} from '@angular/core';
import {CHART_DIRECTIVES} from 'angular2-highcharts';

@Component({
	selector: 'balance',
	templateUrl: 'scripts/components/monthly-stats/balance/balance.html',
	directives: [CHART_DIRECTIVES]
})
export class BalanceComponent implements OnInit {
	public options;
	@Input() data: ITB.Stats;

	constructor() {
	}

	public ngOnInit() {
		console.log(this.data);
		this.options = {
			chart: {type: 'bar'},
			plotOptions: {series: {stacking: 'normal'}},
			legend: {
				enabled: false
			},
			tooltip: {
				useHTML: true,
				formatter: function () {
					return '<div class="tooltip-content">' + this.series.name + ': <strong>' + this.point.y.toFixed(2) + ' ₪</strong></div>';
				}
			}
		};
	}
}
