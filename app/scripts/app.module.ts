import {NgModule, LOCALE_ID}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpModule} from '@angular/http';
import {ChartModule} from 'angular2-highcharts';
import {TenBisComponent}  from './components/ten-bis/ten-bis';
import {MonthlyStatsComponent}  from './components/monthly-stats/monthly-stats';
import {BalanceComponent}  from './components/monthly-stats/balance/balance';
import {DetailedChargersComponent}  from './components/monthly-stats/detailed-charges/detailed-charges';
import {Configs} from './commons/configs';
import {MonthNavigatorComponent} from './components/monthly-stats/month-navigator/month-navigator';
import localeHe from '@angular/common/locales/he';
import {registerLocaleData} from '@angular/common';

registerLocaleData(localeHe);

@NgModule({
	imports: [
		BrowserModule,
		HttpModule,
		ChartModule.forRoot(require('highcharts'))
	],
	declarations: [
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