import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserJWTInfo } from 'src/models/app-models';
import { AuthService } from 'src/services/auth.service';
import { RegisterService } from 'src/services/registration.service';

@Component({
  selector: 'personal-details-form',
  templateUrl: './personal-details-form.component.html',
  styleUrls: []
})
export class PersonalDetailsFormComponent implements OnInit {
    accountType!: string
    userId!: string
    userSubscription: Subscription | undefined
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
		const userId = this.route.snapshot.queryParamMap.get('id')
        const type = this.route.snapshot.paramMap.get('type')
        if( userId && type ) {
            this.userId = userId
            this.accountType = type
        } else {
            this.router.navigate(['/'])
        }
        this.auth.user$.subscribe(userData => {
            this.matDialog.closeAll()
		    this.router.navigate(['account', type])
        })
	 }

     ngOnDestroy(){
         this.userSubscription && this.userSubscription.unsubscribe()
     }
	submitFinal() {
		if(!this.accountType || !this.userId) return
		const value = this.personalDetailsForm.value
		this.register.completeProfile(this.accountType, this.userId, value)
	}
}
