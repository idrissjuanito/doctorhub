import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

const BASE_URL = 'http://localhost:6500'
interface AuthResp {
	sessionToken: string
}

@Injectable({providedIn: 'root'})
export class RegisterService {
	constructor(
		private http: HttpClient,
		private router: Router){}
	registerInitial(resource: string, payload: object){
		const URL = BASE_URL+'/profile/'+resource
		return this.http.post<AuthResp>(BASE_URL+'/profile/'+resource, payload)
	}
	completeProfile(resource: string, user_id: string, payload: object) {
		const URL = BASE_URL+'/profile/'+resource+'s'
		const token = localStorage.getItem('sessionToken')
		if (token == null) return null
		const httpOptions = {
			headers: new HttpHeaders({
				Authorization: 'Bearer '+token
			}),
			params: new HttpParams().set('id', user_id)
		}
		return this.http.put<AuthResp>(URL, payload, httpOptions)
	}
}
