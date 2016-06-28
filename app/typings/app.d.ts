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
	}
	
	export interface User {
		id: string;
		firstName: string;
		lastName: string;
		email: string;
		cellphone: string;
		encryptedId: string;
	}
}