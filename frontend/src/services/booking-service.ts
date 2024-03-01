import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment.development";
import { BookingModel, IAppointment } from "src/models/app-models";


interface ResourceResponse<T> {
	results: T
}
@Injectable({providedIn: 'root'})
export class BookingService {
	constructor(private http: HttpClient){}
	reqUrl = environment.apiUrl+"/appointments"

	new(appointmentData: IAppointment) {
		return this.http.post(this.reqUrl, appointmentData)
	}

	getAppointment(appointmentId?: string) {
		const token = localStorage.getItem('sessionToken')
		if (token == null) return null
		const httpOptions: any = {
			headers: new HttpHeaders({
				Authorization: 'Bearer '+token
			}),
			params() {
				if(!appointmentId) return null
				return new HttpParams().set('appointment_id', appointmentId)
			}
		}
		return this.http.get<ResourceResponse<IAppointment>>(this.reqUrl, httpOptions)
	}
}
