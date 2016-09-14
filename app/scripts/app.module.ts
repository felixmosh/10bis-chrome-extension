import {NgModule, LOCALE_ID}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpModule} from '@angular/http';
import { CHART_DIRECTIVES } from 'angular2-highcharts';
import {TenBisComponent}  from './components/ten-bis/ten-bis';
import {MonthlyStatsComponent}  from './components/monthly-stats/monthly-stats';
import {BalanceComponent}  from './components/monthly-stats/balance/balance';
import {DetailedChargersComponent}  from './components/monthly-stats/detailed-charges/detailed-charges';
import {Configs} from './commons/configs';
import {MonthNavigatorComponent} from './components/monthly-stats/month-navigator/month-navigator';

@NgModule({
	imports: [
		BrowserModule,
		HttpModule
	],
	declarations: [
		CHART_DIRECTIVES,
		TenBisComponent,
		MonthlyStatsComponent,
		BalanceComponent,
		DetailedChargersComponent,
		MonthNavigatorComponent
	],
	providers: [
		{provide: 'Configs', useValue: Configs},
		{provide: LOCALE_ID, useValue: 'he-IL'}
	],
	bootstrap: [TenBisComponent]
})
export class AppModule {
}