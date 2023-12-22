import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

const BASEURL = 'http://localhost:6500'
@Injectable({providedIn: 'root'})
export class DataService {
	constructor(private http: HttpClient){}

	fetch(listing: string) {
		const URL = BASEURL+'/listings/'+listing
		return this.http.get<any>(URL)
	}
}
