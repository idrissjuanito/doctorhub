import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({providedIn: 'root'})
export class DataService {
	constructor(private http: HttpClient){}

	fetch<T>(listing: string, id?: string) {
		let URL = environment.apiUrl+'/listings/'+listing
		if(id)
			URL += `?id=${id}`
		return this.http.get<T>(URL)
	}
}
