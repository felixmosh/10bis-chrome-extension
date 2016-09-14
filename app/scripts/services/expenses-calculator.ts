import {Injectable} from '@angular/core';


@Injectable()
export class ExpensesCalculatorService {
	private workingDaysTillToday = 0;
	private monthlyWorkingDays = 0;
	private today = new Date();

	constructor() {
		this.calculateWorkingDays();
	}

	public calculate(stats: ITB.Stats) {
		let wasTransactionToday = this.wasTransactionToday(stats.transactions);
		if (wasTransactionToday) {
			this.workingDaysTillToday++;
		}
		stats.coveredByCompany = stats.dailyCompanyLimit * this.workingDaysTillToday;
		stats.totalCoveredByCompany = stats.dailyCompanyLimit * this.monthlyWorkingDays;
		stats.onMe = parseFloat(Math.max(0, stats.monthlyUsed - stats.coveredByCompany).toFixed(2));

		if (stats.onMe > 0) {
			stats.remainingForToday = ((wasTransactionToday || !this.isWorkingDay(this.today)) ? 0 : stats.dailyCompanyLimit);
		} else {
			stats.remainingForToday = stats.coveredByCompany - stats.monthlyUsed + ((!wasTransactionToday) ? stats.dailyCompanyLimit : 0);
			stats.remainingForToday = Math.min(100, stats.remainingForToday);
		}

		stats.avgTillEndOfTheMonth = (stats.totalCoveredByCompany - stats.monthlyUsed) / (this.monthlyWorkingDays - this.workingDaysTillToday);
		stats.avgTillEndOfTheMonth = Math.max(0, parseFloat(stats.avgTillEndOfTheMonth.toFixed(2)));
		return stats;
	}

	private calculateWorkingDays() {
		let currentMonth = this.today.getMonth();
		let currentDay = new Date(this.today.getFullYear(), currentMonth, 1);

		while (currentDay.getMonth() === currentMonth) {
			if (this.isWorkingDay(currentDay)) {
				this.monthlyWorkingDays++;

				if (currentDay.getDate() < this.today.getDate()) {
					this.workingDaysTillToday++;
				}
			}
			currentDay.setDate(currentDay.getDate() + 1);
		}
	}

	private isWorkingDay(date) {
		return Math.floor(date.getDay() / 5) === 0;
	}

	private wasTransactionToday(transactions: ITB.Transaction[]): boolean {
		return transactions.some((transaction) => transaction.date.getDate() === this.today.getDate());
	}
}
