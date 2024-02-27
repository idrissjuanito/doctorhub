import { Component, EventEmitter, Optional, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';
import { CreateAccountComponent } from '../../dialogs/create-account/create-account.component';
import { MatDialogRef, MatDialogState } from '@angular/material/dialog';

@Component({
  selector: 'login-form',
  templateUrl: './login-form.component.html',
  styleUrls: []
})
export class LoginFormComponent {
	@Output() loginEvent = new EventEmitter<string>()
	loginForm = new FormGroup({
		password: new FormControl('', {nonNullable: true,
							   validators: [
								   Validators.required,
								   Validators.minLength(5)
							   ]}),
		email: new FormControl('',	{nonNullable: true,
							   		validators: [
									  Validators.required,
									  Validators.email,
									  Validators.minLength(8)
								  ]}),
	})
	constructor(private auth: AuthService,
			   private router: Router){}
	submitLogin(){
		if (!this.loginForm.valid){
			console.log('email', this.loginForm.get('email')?.invalid)
			console.log('passwod', this.loginForm.get('password')?.invalid)
			console.log(this.loginForm.errors)
			return
		}
		const res = this.auth.login(this.loginForm.value)
		res.subscribe((user) => {
			const authUser = this.auth.authenticate(user['sessionToken'])
			if(!authUser) return
			this.loginEvent.emit("login complete")
			this.router.navigate(['account'], { queryParams: { type: authUser["user_id"] } })
		})
	}
}
