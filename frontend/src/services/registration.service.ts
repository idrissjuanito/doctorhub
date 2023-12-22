import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

const BASE_URL = 'http://localhost:6500'

@Injectable({providedIn: 'root'})
export class RegisterService {
	constructor(
		private http: HttpClient,
		private router: Router){}
	registerInitial(resource: string, payload: object){
		const URL = BASE_URL+'/profile/'+resource
		return this.http.post<{sessionToken: string}>(BASE_URL+'/profile/'+resource, payload)
	}
	completeProfile(resource: string, payload: object) {
		const URL = BASE_URL+'/profile/'+resource
		const token = localStorage.getItem('sessionToken')
		if (token == null) return null
		const httpOptions = {headers: new HttpHeaders({
			Authorization: 'Bearer '+JSON.parse(token || '')
		})}
		return this.http.put<string>(URL, payload, httpOptions)
	}
}
