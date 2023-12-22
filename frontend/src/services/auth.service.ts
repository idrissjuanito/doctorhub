import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { JwtPayload, jwtDecode } from "jwt-decode";

@Injectable({providedIn: 'root'})
export class AuthService {
	constructor(private http: HttpClient){}
	isAuthenticated(): boolean {
		interface UserJWTInfo {
			email: string;
			account_id: string;
			user_id: string;
			exp: number;
		}
		const token = localStorage.getItem('sessionToken')
		if (token == null) return false
		try {
			const user_info = jwtDecode<UserJWTInfo>(JSON.parse(token))
			if (Date.now() > (user_info.exp || 0)) {
				localStorage.removeItem('sessionToken')
				return false
			}
			return true
		} catch(error) {
			console.log(error)
			return false
		}
	}
	authenticate (token: string) {
		localStorage.setItem('sessionToken', JSON.stringify(token))
	}
	login(logins: {email: string, password: string}) {
		const BASE_URL =  'http://localhost:6500'
		const res = this.http.post<{sessionToken: string}>(BASE_URL+'/auth/login', logins)
		res.subscribe((data) => this.authenticate(data['sessionToken']))
	}
}
