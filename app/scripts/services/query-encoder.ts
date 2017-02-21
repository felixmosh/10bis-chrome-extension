import {QueryEncoder} from '@angular/http';

export class MyQueryEncoder extends QueryEncoder {
	encodeValue(v: string): string {
		return encodeURIComponent(v);
	}
}