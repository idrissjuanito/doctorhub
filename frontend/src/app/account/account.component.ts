import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AccountService } from 'src/services/account.service';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
	loading: boolean = false
	authUser: string | null = null
	settingForm = new FormGroup({
		email: new FormControl(''),
		password: new FormControl()
	})
	constructor(private auth: AuthService,
			   private router: Router,
			   private route: ActivatedRoute,
			   private account: AccountService){}
	ngOnInit(){
		this.authUser = this.auth.isAuthenticated()
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
