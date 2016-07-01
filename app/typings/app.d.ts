declare module ITB {
	export module Response {
		export interface Login {
			UserData: UserData;
			Success: boolean;
		}

		export interface UserData {
			Cellphone: string;
			CompanyID: number;
			EncryptedUserId: string;
			FacebookUserId: number
			Token: string;
			UserActivated: boolean;
			UserEmail: string;
			UserFirstName: string;
			UserId: number;
			UserLastName: string;
			UserThumbnail: string;
		}

		export interface Stats {
			Moneycards: Moneycards;
			Transactions: Transaction[];
		}

		export interface Transaction {
			ResName: string;
			TransactionAmount: number;
			TransactionDate: string;
			PaymentMethod: string;
		}

		export interface Moneycards {
			MonthlyLimit: number;
			DailyLimit: number;
			MonthlyUsage: number;
			DailyUsage: number;
			DailyBalance: number;
			MonthlyBalance: number;
		}
	}

	export interface User {
		id: number;
		firstName: string;
		lastName: string;
		email: string;
		cellphone: string;
		encryptedId: string;
	}

	export interface Stats {
		transactions: Transaction[];
		monthlyUsed: number;
		dailyCompanyLimit: number;
		coveredByCompany: number;
		onMe: number;
		totalCoveredByCompany: number;
		remainingForToday: number;
		avgTillEndOfTheMonth: number;
	}

	export interface Transaction {
		restaurant: string;
		amount: number;
		date: Date;
	}
}