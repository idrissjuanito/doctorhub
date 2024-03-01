import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/services/auth.service';
import { RegisterService } from 'src/services/registration.service';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: []
})
export class CreateAccountComponent {
	loginForm: boolean = false
	signupForm: boolean = true
	personalDetailsForm: boolean = false
	accountFormGroup!: FormGroup

	constructor(private register: RegisterService,
			   private auth: AuthService,
			   public matDialog: MatDialog){}
	switchForm() {
		this.loginForm = !this.loginForm
		this.signupForm = !this.signupForm
	}
	setAccountFormGroup(formGroup: any) {
		this.accountFormGroup = formGroup
	}
	createPatientAccount() {
		console.log(this.accountFormGroup.value)
		const res = this.register.registerInitial("patients", this.accountFormGroup.value)
		res.subscribe( data => {
			localStorage.setItem("sessionToken", data["sessionToken"])
			this.auth.authenticate()
			this.signupForm = false
			this.personalDetailsForm = true
		} )
	}
	closeDialog(msg: any) {
		this.matDialog.closeAll()
	}
}
