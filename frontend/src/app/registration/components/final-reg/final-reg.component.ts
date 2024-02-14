import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
	authUser: string | null = ''
	constructor(
		private auth: AuthService,
		private router: Router,
		private route:  ActivatedRoute,
		private register: RegisterService){}
	 ngOnInit(){
		this.authUser = this.auth.isAuthenticated()
		this.authUser || this.router.navigate(['/'])
	 }
	submitFinal(){
		const user_id = this.route.snapshot.paramMap.get('id')
		if (user_id) {
			const res = this.register.completeProfile('doctor', user_id, this.finalForm.value)
			if(res) {
				res.subscribe(data => {
					this.auth.authenticate(data['sessionToken'])
					this.router.navigate(['account', user_id])
				})
			}
		}
	}
}
