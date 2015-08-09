'use strict';
/*global Highcharts*/

(function () {
	var baseUrl = 'http://www.10bis.co.il';
	var app = angular.module('10BisApp', ['highcharts-ng']);

	app.controller('mainCtrl', ['dataService', 'calculatorService', 'chartsService', function (dataService, calculatorService, chartsService) {
		var _this = this;
		this.data = {};
		this.isLoaded = false;

		dataService.loadData().then(function (data) {
			angular.extend(_this.data, data);

			dataService.loadExpenses().then(function (data) {
				var calculatedData = calculatorService.calculate(data);
				angular.extend(_this.data, calculatedData);
				_this.monthlyChartConfig = chartsService.prepareMonthlyChart(_this.data);
				_this.totalsChartConfig = chartsService.prepareTotalsChart(_this.data);
				_this.isLoaded = true;
			});
		});

		this.userLoggedIn = function () {
			return this.data.hasOwnProperty('user');
		};
	}]);

	app.service('chartsService', [function () {
		var _this = this;

		this.monthlyChartConfig = {
			options: {
				chart: {
					type: 'line'
				},
				tooltip: {
					useHTML: true,
					formatter: function () {
						var hasManyRestaurants = this.point.expenses.length > 1;
						var restaurantsList = this.point.expenses.map(function (item) {
							return item.restaurant + ((hasManyRestaurants) ? ' - ' + item.amount + ' ₪' : '');
						}).join('<br />');
						return '<div class="tooltip-content">' +
							restaurantsList + '<br />' +
							'<span>' + Highcharts.dateFormat('%A, %d/%m', this.point.x) + '</span>' +
							'<strong>' + this.series.name + ': ' + this.point.y + ' ₪</strong></div>';
					}
				},
				legend: {
					enabled: false
				}
			},
			series: [{
				name: 'סה״כ',
				data: []
			}],
			xAxis: {
				type: 'datetime',
				dateTimeLabelFormats: {
					day: '%d/%m'
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
			},
			loading: true
		};

		this.totalsChartConfig = {
			options: {
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
			},
			series: [],
			yAxis: {
				title: {
					margin: 0,
					text: ''
				},
				reversedStacks: false
			},
			title: {text: '', margin: 0},
			credits: {enabled: false},
			loading: true
		};

		this.prepareMonthlyChart = function (data) {
			var lastDay = -1;
			data.transactions.forEach(function (transaction) {
				// Join expenses from the same day
				if (lastDay === transaction.date.getDate()) {
					var lastEntry = _this.monthlyChartConfig.series[0].data[_this.monthlyChartConfig.series[0].data.length - 1];
					lastEntry.y += transaction.amount;
					lastEntry.expenses.push({
						amount: transaction.amount,
						restaurant: transaction.restaurant
					});
				}
				else {
					_this.monthlyChartConfig.series[0].data.push({
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
			this.monthlyChartConfig.yAxis.plotLines[0].value = data.dailyCompanyLimit;
			this.monthlyChartConfig.loading = false;

			return this.monthlyChartConfig;
		};

		this.prepareTotalsChart = function (data) {
			if (data.monthlyUsed > data.totalCoveredByCompany) {
				this.totalsChartConfig.series.push({
					data: [data.totalCoveredByCompany],
					name: 'מסובסד',
					color: 'green'
				});

				this.totalsChartConfig.series.push({
					data: [data.monthlyUsed - data.totalCoveredByCompany],
					name: 'חריגה',
					color: 'red'
				});

				this.totalsChartConfig.yAxis.max = data.monthlyUsed;
			}
			else {
				if (data.monthlyUsed > data.coveredByCompany) {
					this.totalsChartConfig.series.push({
						data: [data.coveredByCompany],
						name: 'מסובסד',
						color: 'green'
					});

					this.totalsChartConfig.series.push({
						data: [data.monthlyUsed - data.coveredByCompany],
						name: 'חריגה',
						color: 'red'
					});

					this.totalsChartConfig.series.push({
						data: [data.totalCoveredByCompany - data.monthlyUsed],
						name: 'יתרה',
						color: 'lightgray'
					});
				}
				else {
					this.totalsChartConfig.series.push({
						data: [data.monthlyUsed],
						name: 'שימוש חודשי',
						color: 'lightgreen'
					});

					this.totalsChartConfig.series.push({
						data: [data.coveredByCompany - data.monthlyUsed],
						name: 'יתרה יומית',
						color: 'green'
					});

					this.totalsChartConfig.series.push({
						data: [data.totalCoveredByCompany - data.coveredByCompany],
						name: 'יתרה',
						color: 'lightgray'
					});
				}

				this.totalsChartConfig.yAxis.max = data.totalCoveredByCompany;
			}
			this.totalsChartConfig.loading = false;

			return this.totalsChartConfig;
		};
	}]);

	app.service('calculatorService', [function () {
		this.workingDaysTillToday = 0;
		this.monthlyWorkingDays = 0;
		var today = new Date();

		var isWorkingDay = function (date) {
			return parseInt(date.getDay() / 5) === 0;
		};

		this.updateWorkingDays = function () {
			var currentMonth = today.getMonth();
			var currentDay = new Date(today.getFullYear(), currentMonth, 1);

			while (currentDay.getMonth() === currentMonth) {
				if (isWorkingDay(currentDay)) {
					this.monthlyWorkingDays++;

					if (currentDay.getDate() < today.getDate()) {
						this.workingDaysTillToday++;
					}
				}
				currentDay.setDate(currentDay.getDate() + 1);
			}
		};

		this.calculate = function (data) {
			var wasTransactionToday = this.wasTransactionToday(data.transactions);
			if (wasTransactionToday) {
				this.workingDaysTillToday++;
			}
			data.coveredByCompany = data.dailyCompanyLimit * this.workingDaysTillToday;
			data.totalCoveredByCompany = this.monthlyWorkingDays * data.dailyCompanyLimit;
			data.onMe = Math.max(0, data.monthlyUsed - data.coveredByCompany);

			if (data.onMe > 0) {
				data.remainingForToday = ((wasTransactionToday || !isWorkingDay(today)) ? 0 : data.dailyCompanyLimit);
			}
			else {
				data.remainingForToday = Math.min(data.coveredByCompany - data.monthlyUsed + ((!wasTransactionToday) ? data.dailyCompanyLimit : 0), 100);
			}

			data.avgTillEndOfTheMonth = Math.max(0, (data.totalCoveredByCompany - data.monthlyUsed) / (this.monthlyWorkingDays - this.workingDaysTillToday));

			return data;
		};

		this.wasTransactionToday = function (transactions) {
			var today = new Date();
			return transactions.filter(function (transaction) {
					return transaction.date.getDate() === today.getDate();
				}).length > 0;
		};

		this.updateWorkingDays();
	}]);

	app.service('dataService', ['$http', '$q', function ($http, $q) {
		var _this = this;
		var data = {};

		this.isLoggedIn = function () {
			var defered = $q.defer();

			chrome.cookies.get({name: 'uid', url: baseUrl}, function (cookie) {
				if (cookie !== null) {
					defered.resolve({isLoggedIn: true, id: cookie.value});
				}
				else {
					defered.resolve({isLoggedIn: false});
				}
			});

			return defered.promise;
		};

		this.login = function (userId) {
			var queryParams = {
				encryptedUserId: userId,
				shoppingCartGuid: '',
				WebsiteId: '10bis',
				DomainId: '10bis'
			};

			queryParams = toQueryString(queryParams);

			return $http.get(baseUrl + '/api/Login?' + queryParams).then(function (response) {
				return (response.data.Success) ? {
					id: response.data.UserData.EncryptedUserId,
					firstName: response.data.UserData.UserFirstName,
					lastName: response.data.UserData.UserLastName
				} : {};
			});
		};

		this.saveData = function () {
			var defered = $q.defer();
			chrome.storage.sync.set({
				data: data
			}, function () {
				defered.resolve();
			});

			return defered.promise;
		};

		this.loadData = function () {
			var defered = $q.defer();

			this.isLoggedIn().then(function (response) {
				if (response.isLoggedIn) {
					chrome.storage.sync.get({
						data: data
					}, function (items) {
						if (items.data.hasOwnProperty('user') && items.data.user.hasOwnProperty('id')) {
							angular.extend(data, items.data);
							defered.resolve(data);
						}
						else {
							_this.login(response.id).then(function (user) {
								data.user = user;

								_this.saveData().then(function () {
									defered.resolve(data);

								});
							});
						}
					});
				}
				else {
					chrome.storage.sync.remove('data', function () {
						defered.resolve(data);
					});
				}
			});

			return defered.promise;
		};

		this.loadExpenses = function () {
			var queryParams = {
				encryptedUserId: data.user.id,
				dateBias: 0,
				WebsiteId: '10bis',
				DomainId: '10bis'
			};
			queryParams = toQueryString(queryParams);
			return $http.get(baseUrl + '/api/UserTransactionsReport?' + queryParams).then(function (response) {
				return {
					monthlyUsed: response.data.Moneycards[0].MonthlyUsage,
					dailyCompanyLimit: 35,
					transactions: response.data.Transactions.filter(function (transaction) {
						return transaction.PaymentMethod === 'Moneycard';
					}).map(function (transaction) {
						return {
							amount: transaction.TransactionAmount,
							date: new Date(parseInt(transaction.TransactionDate.replace(/[^\d]+/ig, ''), 10)),
							restaurant: transaction.ResName
						};
					})
				};
			});
		};

		function toQueryString(data) {
			return Object.keys(data).reduce(function (a, k) {
				a.push(k + '=' + encodeURIComponent(data[k]));
				return a;
			}, []).join('&');
		}
	}])
	;

})
();
