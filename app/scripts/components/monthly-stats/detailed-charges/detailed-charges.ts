import {Component, OnInit, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Highcharts} from 'angular2-highcharts';
Highcharts.setOptions({
	lang: {
		weekdays: ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת']
	}
});

@Component({
	selector: 'detailed-charges',
	templateUrl: './detailed-charges.html'
})
export class DetailedChargersComponent implements OnInit, OnChanges {
	public options;
	public isLoaded: boolean = false;
	@Input() stats: ITB.Stats;
	private chart;

	constructor() {
	}

	public ngOnInit() {
		this.options = {
			chart: {
				type: 'column'
			},
			tooltip: {
				useHTML: true,
				formatter: function () {
					var hasManyRestaurants = this.point.expenses.length > 1;
					var restaurantsList = this.point.expenses.map(function (item) {
						return item.restaurant + ((hasManyRestaurants) ? ` - ${item.amount} &#8362;` : '');
					}).join('<br />');
					return `<div class="tooltip-content">
						${restaurantsList}<br />
						<span>${Highcharts.dateFormat('יום %A, %d/%m', this.point.x)}</span>
						<strong>${this.series.name}: ${this.point.y} &#8362;</strong></div>`;
				}
			},
			legend: {
				enabled: false
			},
			series: [{
				name: 'סה״כ',
				pointRange: 24 * 3600 * 1000,
				data: []
			}],
			xAxis: {
				type: 'datetime',
				tickInterval: 24 * 3600 * 1000,
				dateTimeLabelFormats: {
					day: '%d/%m'
				},
				labels: {
					step: 2
				}
			},
			yAxis: {
				plotLines: [{
					color: 'gray',
					width: 1,
					value: 0,
					dashStyle: 'longdashdot'
				}],
				title: {
					margin: 0,
					text: ''
				}
			},
			title: {
				margin: 0,
				text: ''
			},
			credits: {
				enabled: false
			}
		};
	}

	public ngOnChanges(changes: SimpleChanges) {
		if (typeof changes['stats'].currentValue.coveredByCompany !== 'undefined') {
			this.prepareChartData(changes['stats'].currentValue);
		}
	}

	public saveInstance(chart) {
		this.chart = chart;
	}

	private prepareChartData(stats: ITB.Stats) {
		this.options.series[0].data.length = 0;
		var lastDay = -1;
		stats.transactions.forEach((transaction) => {
			// Join expenses from the same day
			if (lastDay === transaction.date.getDate()) {
				var lastEntry = this.options.series[0].data[this.options.series[0].data.length - 1];
				lastEntry.y += transaction.amount;
				lastEntry.expenses.push({
					amount: transaction.amount,
					restaurant: transaction.restaurant
				});
			}
			else {
				this.options.series[0].data.push({
					x: transaction.date.getTime(),
					y: transaction.amount,
					expenses: [{
						amount: transaction.amount,
						restaurant: transaction.restaurant
					}]
				});
			}
			lastDay = transaction.date.getDate();
		});

		this.options.series[0].data.sort((item1, item2) => item1.x - item2.x);

		this.options.yAxis.plotLines[0].value = stats.dailyCompanyLimit;
		this.options.xAxis.labels.step = Math.max(2, Math.round(this.options.series[0].data.length / 4.5));
		console.log(this.options.xAxis.labels.step, this.options.series[0].data.length);

		this.isLoaded = true;

		if (this.chart) {
			this.updateChart();
		}
	}

	private updateChart() {
		this.chart.xAxis[0].update(this.options.xAxis, false);
		this.chart.series[0].setData(this.options.series[0].data, false);
		this.chart.redraw();
	}
}
