import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AccountService } from 'src/services/account.service';
import { AuthService } from 'src/services/auth.service';
import { ConfirmBookingComponent } from '../components/dialogs/confirm-booking/confirm-dialog-component';
import { BookingModel, IUserProfile, UserJWTInfo } from 'src/models/app-models';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: []
})
export class AccountComponent implements OnInit {
	loading: boolean = false
	authUser!: UserJWTInfo
	profile!: IUserProfile
	userType: string | undefined
	settingForm = new FormGroup({
		email: new FormControl(''),
		password: new FormControl()
	})

	constructor(private auth: AuthService,
			   private router: Router,
			   private route: ActivatedRoute,
			   private account: AccountService,
			   public matDialog: MatDialog){}

	ngOnInit(){
		const user_info = this.auth.isAuthenticated()
		if(user_info) {
			this.authUser = user_info
			this.userType = user_info["account_type"]
			const request = this.auth.getUserProfile<IUserProfile>(this.userType)
			request.subscribe(profile => {
				this.profile = profile["results"]

				if(this.userType == "patient") {
					const dataString = localStorage.getItem("tempBookingData")
					if(dataString) {
						const booking: BookingModel = JSON.parse(dataString)
						this.profile["email"] = this.authUser["email"]
						booking["patient"] = this.profile
						this.matDialog.open(ConfirmBookingComponent, { data: booking})
					}
				}
			})
		}
		!this.authUser && this.router.navigate(['/'])
	}

	handleFileUpload(event: Event) {
		console.log("Loading...")
		this.loading = !this.loading;
		const fl = (event.target as HTMLInputElement).files
		if(fl)
			this.account.updateProfile(this.authUser["user_id"] || '', 'profileImage', fl[0])
	}

	submitSettings() {
		this.account.updateProfile(this.authUser["user_id"] || '',
								   'account', this.settingForm.value)
	}
}
