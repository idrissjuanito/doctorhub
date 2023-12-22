import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, switchMap } from 'rxjs';
import { RegisterService } from 'src/services/registration.service';
import { jwtDecode } from 'jwt-decode'
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-start',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
	entity: any | null
	doctorForm = new FormGroup({
		hospital_name: new FormControl(''),
		speciality: new FormControl(''),
		license_num: new FormControl('')
	})
	hospitalForm = new FormGroup({
		name: new FormControl(''),
		reg_number: new FormControl(''),
	})
	accountForm = new FormGroup({
		email: new FormControl(''),
		password: new FormControl('')
	})

	constructor(private router: Router,
				private register: RegisterService,
			   	private route: ActivatedRoute,
			   	private auth: AuthService){}
	ngOnInit(){
		this.entity = this.route.snapshot.paramMap.get('type')
	}
	submitAccount(entity: string | null){
		let form: FormGroup
		if (entity == 'doctor')
			form = this.doctorForm
		else
			form = this.hospitalForm
		const formData = {...form.value, ...this.accountForm.value}
		const res = this.register.registerInitial(entity+'s', formData)
		res.subscribe(data => {
			this.auth.authenticate(data['sessionToken'])
			this.router.navigate([data['user_id']], {relativeTo: this.route})
		})
	}
}
