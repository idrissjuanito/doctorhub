import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { UserJWTInfo } from 'src/models/app-models';
import { AuthService } from 'src/services/auth.service';
import { RegisterService } from 'src/services/registration.service';

@Component({
  selector: 'personal-details-form',
  templateUrl: './personal-details-form.component.html',
  styleUrls: []
})
export class PersonalDetailsFormComponent implements OnInit {
	personalDetailsForm = new FormGroup({
		first_name: new FormControl(''),
		last_name: new FormControl(''),
		gender: new FormControl(''),
		state: new FormControl(''),
		city: new FormControl(''),
		address: new FormControl(''),
		contact_one: new FormControl(''),
		contact_two: new FormControl('')
	})
	authUser: UserJWTInfo | null = null
	constructor(
		private auth: AuthService,
		private router: Router,
		private route:  ActivatedRoute,
		private register: RegisterService,
		public matDialog: MatDialog){}
	 ngOnInit(){
		const user_info = this.auth.isAuthenticated()
		user_info && (this.authUser = user_info)
		this.authUser || this.router.navigate(['/'])
	 }
	submitFinal() {
		if(!this.authUser) return
		const account_type = this.authUser["account_type"]
		const userId = this.authUser["user_id"]
		const value = this.personalDetailsForm.value
		const res = this.register.completeProfile(account_type, userId, value)
		res?.subscribe(data => {
			this.matDialog.closeAll()
			this.auth.authenticate(data['sessionToken'])
			this.authUser = this.auth.isAuthenticated()
			this.router.navigate(['account'], {queryParams: {type: account_type}})
		})
	}
}
