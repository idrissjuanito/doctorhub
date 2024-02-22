import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AccountService } from 'src/services/account.service';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: []
})
export class AccountComponent implements OnInit {
	loading: boolean = false
	authUser: string | null = null
	userType: string | undefined
	settingForm = new FormGroup({
		email: new FormControl(''),
		password: new FormControl()
	})
	constructor(private auth: AuthService,
			   private router: Router,
			   private route: ActivatedRoute,
			   private account: AccountService){}
	ngOnInit(){
		const user_info = this.auth.isAuthenticated()
		if(user_info) {
			this.authUser = user_info["user_id"]
			this.userType = user_info["account_type"]
		}
		!this.authUser ? this.router.navigate(['/'])
			: this.router.navigate([this.authUser], {relativeTo: this.route})
	}
	handleFileUpload(event: Event) {
		console.log("Loading...")
		this.loading = !this.loading;
		const fl = (event.target as HTMLInputElement).files
		if(fl)
			this.account.updateProfile(this.authUser || '', 'profileImage', fl[0])
	}
	submitSettings() {
		this.account.updateProfile(this.authUser || '', 'account', this.settingForm.value)
	}
}
