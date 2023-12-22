import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';
import { RegisterService } from 'src/services/registration.service';

@Component({
  selector: 'app-final-reg',
  templateUrl: './final-reg.component.html',
  styleUrls: ['./final-reg.component.css']
})
export class FinalRegComponent implements OnInit {
	finalForm = new FormGroup({
		first_name: new FormControl(''),
		last_name: new FormControl(''),
		gender: new FormControl(''),
		state: new FormControl(''),
		city: new FormControl(''),
		address: new FormControl(''),
		contact_one: new FormControl(''),
		contact_two: new FormControl('')
	})
	constructor(
		private auth: AuthService,
		private router: Router,
		private register: RegisterService){}
	 ngOnInit(){
		this.auth.isAuthenticated()	|| this.router.navigate(['/'])
	 }
	submitFinal(){
		const res = this.register.completeProfile('doctor', this.finalForm.value)
		if(res) res.subscribe(data => console.log(data))
	}
}
