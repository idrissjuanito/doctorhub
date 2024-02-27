import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment.development";
import { BookingModel, IAppointment } from "src/models/app-models";


@Injectable({providedIn: 'root'})
export class BookingService {
	constructor(private http: HttpClient){}

	new(appointmentData: IAppointment) {
		const reqUrl = environment.apiUrl+"/appointments"
		return this.http.post(reqUrl, appointmentData)
	}
}
