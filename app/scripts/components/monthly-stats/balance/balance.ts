import {Component, OnInit, Input, OnChanges, SimpleChanges} from '@angular/core';

@Component({
	selector: 'balance',
	templateUrl: './balance.html'
})
export class BalanceComponent implements OnInit, OnChanges {
	public options;
	public isLoaded: boolean = false;
	@Input() stats: ITB.Stats;
	private chart;

	constructor() {
		this.ngOnInit();
	}

	public ngOnInit() {
		this.options = {
			chart: {type: 'bar'},
			plotOptions: {series: {stacking: 'normal'}},
			legend: {
				enabled: false
			},
			tooltip: {
				useHTML: true,
				formatter: function () {
					return `<div class="tooltip-content">${this.series.name}: <strong>${this.point.y.toFixed(2)} &#8362;</strong></div>`;
				}
			},
			series: [],
			yAxis: {
				title: {
					margin: 0,
					text: ''
				},
				max: null,
				reversedStacks: false
			},
			title: {text: '', margin: 0},
			credits: {enabled: false}
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
		this.options.series.length = 0;

		if (stats.monthlyUsed > stats.totalCoveredByCompany) {
			this.options.series.push({
				data: [stats.totalCoveredByCompany],
				name: 'מסובסד',
				color: 'green'
			});

			this.options.series.push({
				data: [stats.monthlyUsed - stats.totalCoveredByCompany],
				name: 'חריגה',
				color: 'red'
			});
		}
		else {
			if (stats.monthlyUsed > stats.coveredByCompany) {
				this.options.series.push({
					data: [stats.coveredByCompany],
					name: 'מסובסד',
					color: 'green'
				});

				this.options.series.push({
					data: [stats.monthlyUsed - stats.coveredByCompany],
					name: 'חריגה',
					color: 'red'
				});

				this.options.series.push({
					data: [stats.totalCoveredByCompany - stats.monthlyUsed],
					name: 'יתרה',
					color: 'lightgray'
				});
			}
			else {
				this.options.series.push({
					data: [stats.monthlyUsed],
					name: 'שימוש חודשי',
					color: 'lightgreen'
				});

				this.options.series.push({
					data: [stats.coveredByCompany - stats.monthlyUsed],
					name: 'יתרה יומית',
					color: 'green'
				});

				this.options.series.push({
					data: [stats.totalCoveredByCompany - stats.coveredByCompany],
					name: 'יתרה',
					color: 'lightgray'
				});
			}
		}
		this.isLoaded = true;
		if (this.chart) {
			this.updateChart();
		}
	}

	private updateChart() {
		while (this.chart.series.length > 0) {
			this.chart.series[0].remove(false);
		}
		this.options.series.forEach((serie) => this.chart.addSeries(serie, false));
		this.chart.redraw();
	}
}
