import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { JwtPayload, jwtDecode } from "jwt-decode";

@Injectable({providedIn: 'root'})
export class AuthService {
	constructor(private http: HttpClient,
			   private router: Router){}
	isAuthenticated(): string | null {
		interface UserJWTInfo {
			email: string;
			account_id: string;
			user_id: string;
			exp: number;
		}
		const token = localStorage.getItem('sessionToken')
		if (token == null) return null
		try {
			const user_info = jwtDecode<UserJWTInfo>(JSON.parse(token))
			if (Date.now() > (user_info.exp || 0)) {
				console.log(user_info)
				localStorage.removeItem('sessionToken')
				return null
			}
			return user_info['user_id']
		} catch(error) {
			console.log(error)
			localStorage.removeItem('sessionToken')
			return null
		}
	}
	authenticate (token: string) {
		localStorage.setItem('sessionToken', JSON.stringify(token))
	}
	login(logins: object) {
		console.log(logins)
		const BASE_URL =  'http://localhost:6500'
		return this.http.post<{user_id: string, sessionToken: string}>(BASE_URL+'/auth/login', logins)
	}
	logout () {
		localStorage.removeItem('sessionToken')
		this.router.navigate(['/'])
	}
}
