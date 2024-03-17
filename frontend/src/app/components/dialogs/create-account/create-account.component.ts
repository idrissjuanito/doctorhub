import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';
import { RegisterService } from 'src/services/registration.service';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: []
})
export class CreateAccountComponent implements OnInit {
	loginForm: boolean = false
	signupForm: boolean = true
	accountFormGroup!: FormGroup

	constructor(private register: RegisterService,
                private router: Router,
			   public matDialog: MatDialog){}

    ngOnInit() {}

	switchForm() {
		this.loginForm = !this.loginForm
		this.signupForm = !this.signupForm
	}

	setAccountFormGroup(formGroup: any) {
		this.accountFormGroup = formGroup
	}

	createPatientAccount() {
	    console.log('Creating patient...')
	    this.register.registerInitial("patient", this.accountFormGroup.value)
        this.matDialog.closeAll()
	}

	closeDialog(msg: any) {
		this.matDialog.closeAll()
	}
}
