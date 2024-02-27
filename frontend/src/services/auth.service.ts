import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { JwtPayload, jwtDecode } from "jwt-decode";
import { environment } from "src/environments/environment.development";
import { UserJWTInfo } from "src/models/app-models";

const BASE_URL = environment.apiUrl
@Injectable({providedIn: 'root'})
export class AuthService {
	constructor(private http: HttpClient,
			   private router: Router){}
	isAuthenticated(): UserJWTInfo | null {
		const token = localStorage.getItem('sessionToken')
		if (token == null) return null
		try {
			const user_info = jwtDecode<UserJWTInfo>(token)
			if (Date.now() > (user_info.exp || 0)) {
				console.log(user_info)
				localStorage.removeItem('sessionToken')
				return null
			}
			return user_info
		} catch(error) {
			console.log(error)
			localStorage.removeItem('sessionToken')
			return null
		}
	}
	authenticate (token: string): UserJWTInfo | null {
		localStorage.setItem('sessionToken', token)
		return this.isAuthenticated()
	}
	login(logins: object) {
		return this.http.post<{user_id: string, sessionToken: string}>(BASE_URL+'/auth/login', logins)
	}
	logout () {
		localStorage.removeItem('sessionToken')
		this.router.navigate(['/'])
	}
	getUserProfile<T>(type: string) {
		const token = localStorage.getItem('sessionToken')
		const URL = BASE_URL+"/profile/"+type+"s"
		const httpOptions = {
			headers: new HttpHeaders({
				Authorization: 'Bearer '+token
			}),
		}
		return this.http.get<{results: T}>(URL, httpOptions)
	}
}
