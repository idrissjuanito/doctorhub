import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AccountService } from 'src/services/account.service';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.css']
})
export class AccountSettingsComponent {
	loading: boolean = false
	userId: string | undefined
	settingForm = new FormGroup({
		email: new FormControl(''),
		password: new FormControl()
	})
	constructor(private account: AccountService, private auth: AuthService) {
		this.userId = this.auth.userData?.user_id
	}
	submitSettings() {
		this.account.updateProfile(
			this.userId || '', 'account', this.settingForm.value)
	}

	handleFileUpload(event: Event) {
		console.log("Loading...")
		this.loading = !this.loading;
		const fl = (event.target as HTMLInputElement).files
		if(fl) this.account.updateProfile(this.userId || '', 'profileImage', fl[0])
	}
}
