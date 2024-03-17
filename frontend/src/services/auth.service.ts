import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { JwtPayload, jwtDecode } from "jwt-decode";
import { Observable, Subject, catchError, map, switchMap, tap } from "rxjs";
import { environment } from "src/environments/environment";
import { DoctorType, IPatient, UserJWTInfo } from "src/models/app-models";

interface IUser extends UserJWTInfo {
	profile: IPatient | DoctorType | null
}

const BASE_URL = environment.apiUrl
@Injectable({providedIn: 'root'})
export class AuthService {
	userData: IUser | null = null
	private userSubject: Subject<IUser> = new Subject<IUser>()
	user$: Observable<IUser> = this.userSubject.asObservable()

	constructor(private http: HttpClient, private router: Router) {
		this.user$ = this.user$.pipe(
            switchMap(data => {
                const token = localStorage.getItem("sessionToken")
                console.log('getting user')
                const URL = BASE_URL+"/profile/"+data["account_type"]+"s"
                const httpOptions = {
                    headers: new HttpHeaders({ Authorization: 'Bearer '+token
                    }),
                }
                const request$ = this.http.get<{results: IPatient}>(URL, httpOptions)
                return request$.pipe(map(resp => {
                    data["profile"] = resp["results"]
                    return data
                }))
		    }),
            tap(userData => this.userData = userData),
        )
   	}

	authenticate (sessionToken?: string): void {
		const token = sessionToken ?? localStorage.getItem('sessionToken')
		try {
            sessionToken && localStorage.setItem('sessionToken', sessionToken)
			const user_info = jwtDecode<UserJWTInfo>(token || "")

			if (!user_info || Date.now() > (user_info.exp || 0)) {
                throw new Error("Token expired")
			}
            console.log(this.userSubject.isStopped)
			this.userSubject.next({...user_info, profile: null })
		} catch (err) {
            this.userData = null
			this.userSubject.error("Invalid or expired token")
			token && localStorage.removeItem('sessionToken')
		}
	}

	login(logins: object) {
		const res$ = this.http.post<{sessionToken: string}>(BASE_URL+'/auth/login', logins)
		res$.subscribe(data => {
			this.authenticate(data["sessionToken"])
		})
	}

	logout () {
		localStorage.removeItem('sessionToken')
        this.authenticate()
	}

	getUserProfile(): IPatient | DoctorType | null {
		if(this.userData) return this.userData.profile
		return null
	}
}
