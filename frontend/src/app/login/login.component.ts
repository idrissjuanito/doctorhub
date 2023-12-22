import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
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
			console.log(user)
			this.auth.authenticate(user['sessionToken'])
			this.router.navigate(['account'])
		})
	}
}
