import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment.development";
import { BookingModel } from "src/models/app-models";


@Injectable({providedIn: 'root'})
export class BookingService {
	constructor(private http: HttpClient){}
	new(apData: BookingModel) {
		const reqUrl = environment.apiUrl+"/appointment"
		return this.http.post(environment.apiUrl, apData)
	}
}
