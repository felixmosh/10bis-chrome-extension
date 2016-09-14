import {Component, Input, OnChanges, SimpleChanges, Output, EventEmitter} from '@angular/core';

@Component({
	selector: 'month-navigator',
	templateUrl: './month-navigator.html'
})
export class MonthNavigatorComponent implements OnChanges {

	@Input() dateBias: number;
	@Output() monthChange = new EventEmitter();
	public currentDate: Date;
	private today: Date = new Date();

	constructor() {

	}

	public ngOnChanges(changes: SimpleChanges): void {
		this.currentDate = new Date(this.today.getFullYear(), this.today.getMonth() + this.dateBias);
	}

	public onNext() {
		this.monthChange.emit({value: this.dateBias + 1});
	}

	public onPrev() {
		this.monthChange.emit({value: this.dateBias - 1});
	}
}
