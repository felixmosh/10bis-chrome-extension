'use strict';

(function () {
	var baseUrl = 'https://www.10bis.co.il';
	var app = angular.module('10BisApp', []);

	app.controller('mainCtrl', ['dataService', 'calculatorService', function (dataService, calculatorService) {
		var _this = this;
		this.data = {};

		dataService.loadData().then(function (data) {
			angular.extend(_this.data, data);

			dataService.loadExpenses().then(function (data) {
				var calculatedData = calculatorService.calculate(data);
				angular.extend(_this.data, calculatedData);
			});
		});

		this.userLoggedIn = function () {
			return this.data.hasOwnProperty('user');
		};
	}]);

	app.service('calculatorService', [function () {
		this.workingDaysTillToday = 0;
		this.monthlyWorkingDays = 0;

		this.updateWorkingDays = function () {
			var today = new Date();
			var currentMonth = today.getMonth();
			var currentDay = new Date(today.getFullYear(), currentMonth, 1);

			while (currentDay.getMonth() === currentMonth) {
				if (parseInt(currentDay.getDay() / 5) === 0) {
					this.monthlyWorkingDays++;

					if (currentDay.getDate() < today.getDate()) {
						this.workingDaysTillToday++;
					}
				}
				currentDay.setDate(currentDay.getDate() + 1);
			}
		};

		this.calculate = function (data) {
			var hasTransactionToday = this.hasTransactionToday(data.transactions);
			if (!hasTransactionToday) {
				this.workingDaysTillToday--;
			}
			data.coveredByCompany = data.dailyCompanyLimit * this.workingDaysTillToday;
			data.onMe = Math.max(0, data.monthlyUsed - data.coveredByCompany);
			data.remainingForToday = data.onMe > 0 ? ((hasTransactionToday) ? 0 : data.dailyCompanyLimit) : Math.min(data.monthlyUsed - data.coveredByCompany, 100);
			var totalCoveredByCompany = this.monthlyWorkingDays * data.dailyCompanyLimit;
			data.avgTillEndOfTheMonth = (totalCoveredByCompany - data.monthlyUsed) / (this.monthlyWorkingDays - this.workingDaysTillToday);

			return data;
		};

		this.hasTransactionToday = function (transactions) {
			var today = new Date().getDate();
			return transactions.filter(function (transaction) {
					return transaction.date.getDate() === today;
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
					transactions: response.data.Transactions.map(function (transaction) {
						return {
							amount: transaction.TransactionAmount,
							date: new Date(parseInt(transaction.TransactionDate.replace(/[^\d]+/ig, '')))
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
