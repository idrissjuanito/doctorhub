import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { environment } from "src/environments/environment";
import { AuthService } from "./auth.service";
import { Observable } from "rxjs";

const BASE_URL = environment.apiUrl

interface UserRawData {
    user_id: string
    sessionToken: string
}

@Injectable({providedIn: 'root'})
export class RegisterService {
	constructor(
		private http: HttpClient,
		private router: Router,
		private route: ActivatedRoute,
        private auth: AuthService){}

	registerInitial(resource: string, payload: object) {
		const URL = BASE_URL+'/profile/'+resource
		const res = this.http.post<UserRawData>(BASE_URL+'/profile/'+resource+'s', payload)
        res.subscribe( userData => {
            localStorage.setItem("sessionToken", userData["sessionToken"])
            this.router.navigate(['registration', resource], { relativeTo: this.route, queryParams: {id: userData["user_id"]} })
        })
    }


	completeProfile(resource: string, user_id: string, payload: object) {
		const URL = BASE_URL+'/profile/'+resource+'s'
		const token = localStorage.getItem('sessionToken')
		if (token == null) return
		const httpOptions = {
			headers: new HttpHeaders({
				Authorization: 'Bearer '+token
			}),
			params: new HttpParams().set('id', user_id)
		}

		const res = this.http.put<UserRawData>(URL, payload, httpOptions)
        res.subscribe(data => {
            this.auth.authenticate(data["sessionToken"])
        })
	}
}
