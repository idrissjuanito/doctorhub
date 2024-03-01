import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({providedIn: "root"})
export class AccountService {
	accountSubject: Subject<object> = new Subject<object>()
	account$: Observable<object> = this.accountSubject.asObservable()

	constructor(private http: HttpClient) {}
	updateProfile(userId: string, key: string, value: any) {
		const token = localStorage.getItem('sessionToken')
		if (token == null) return
		const httpOptions = {
			headers: new HttpHeaders({
				Authorization: 'Bearer '+JSON.parse(token),
			}),
		}
		let payload
		if (key == "profileImage") {
			payload = new FormData()
			payload.append("file", value)
		} else {
			payload = {[key]: value}
		}
		const req = this.http.patch(environment.apiUrl+'/profile/doctors', payload, httpOptions)
		req.subscribe((data) => {
			console.log(data)
		})
	}
}
