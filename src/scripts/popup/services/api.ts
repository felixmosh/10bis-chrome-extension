import { IOrder, IUserDetails } from '../../../types/types';
import { BASE_URL, COOKIE_NAME } from '../../constants/constants';
import { chromeService } from './chrome';

interface ITenBisLoginData {
  UserData: {
    UserFirstName: string;
    UserLastName: string;
    EncryptedUserId: string;
    CompanyID: number;
  };
}

interface ITenBisStatsData {
  Transactions: Array<{
    TransactionDate: string;
    TransactionAmount: number;
    ResName: string;
  }>;
}

function convert10BisDateToDate(date: string): Date {
  return new Date(parseInt(date.slice(6, -2), 10));
}

class TenBisApi {
  public async login(): Promise<IUserDetails> {
    const userId = await chromeService.getCookie(COOKIE_NAME, BASE_URL);

    return this.get<ITenBisLoginData>('/Login', {
      encryptedUserId: userId
    }).then(({ UserData }) => ({
      id: UserData.EncryptedUserId,
      firstname: UserData.UserFirstName,
      lastname: UserData.UserLastName,
      companyId: UserData.CompanyID
    }));
  }

  public getUserOrders(
    userId: string,
    monthBias: number
  ): Promise<{ orders: IOrder[] }> {
    return this.get<ITenBisStatsData>('/UserTransactionsReport', {
      encryptedUserId: userId,
      dateBias: monthBias
    }).then((response) => ({
      orders: response.Transactions.map((order) => ({
        date: convert10BisDateToDate(order.TransactionDate),
        price: order.TransactionAmount,
        restaurantName: order.ResName
      }))
    }));
  }

  private get<P>(path: string, data: object): Promise<P> {
    const search: URLSearchParams = new URLSearchParams();
    search.set('shoppingCartGuid', '');
    search.set('WebsiteId', '10bis');
    search.set('DomainId', '10bis');

    Object.entries(data).forEach(([key, value]) => search.append(key, value));
    return fetch(`${BASE_URL}${path}?${search.toString()}`, {
      method: 'GET'
    }).then((body) => body.json());
  }
}

export const tenBisApi = new TenBisApi();
