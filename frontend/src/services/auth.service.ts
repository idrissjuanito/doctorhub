import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { JwtPayload, jwtDecode } from "jwt-decode";
import { Observable, Subject, catchError, map, of, switchMap, tap } from "rxjs";
import { environment } from "src/environments/environment";
import { DoctorType, IPatient, UserJWTInfo } from "src/models/app-models";

interface IUser extends UserJWTInfo {
	profile: IPatient | DoctorType | null
}

const BASE_URL = environment.apiUrl
@Injectable({providedIn: 'root'})
export class AuthService {
	userData: IUser | null = null
	private userSubject: Subject<IUser | null> = new Subject<IUser | null>()
	user$: Observable<IUser | null> = this.userSubject.asObservable()

	constructor(private http: HttpClient, private router: Router) {
		this.user$ = this.user$.pipe(
            switchMap(data => {
                if (data === null)
                    throw 'no user'
                console.log("no errors")
                const token = localStorage.getItem("sessionToken")
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
            catchError(err => {
                console.log("catching errors")
                this.userData = null
                return of(null)
            }),
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
			this.userSubject.next({...user_info, profile: null })
		} catch (err) {
			this.userSubject.next(null)
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
        this.userSubject.next(null)
	}

	getUserProfile(): IPatient | DoctorType | null {
		if(this.userData) return this.userData.profile
		return null
	}
}
