import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';
import { RegisterService } from 'src/services/registration.service';

@Component({
  selector: 'pro-details-form',
  templateUrl: './pro-details-form.component.html',
  styleUrls: []
})
export class ProDetailsFormComponent implements OnInit {
	entity: any | null
	accountFormGroup: FormGroup | undefined
	doctorForm = new FormGroup({
		hospital_name: new FormControl(''),
		speciality: new FormControl(''),
		license_num: new FormControl('')
	})
	hospitalForm = new FormGroup({
		name: new FormControl(''),
		reg_number: new FormControl(''),
	})
	constructor(
		private auth: AuthService,
		private router: Router,
		private route:  ActivatedRoute,
		private register: RegisterService){}

	ngOnInit(){
		this.entity = this.route.snapshot.paramMap.get('type')
	}

	accountFormGroupInit(formGroup: any) {
		this.accountFormGroup = formGroup
	}

	submitProAccountDetails(){
		let form: FormGroup
		if (this.entity == 'doctor')
			form = this.doctorForm
		else
			form = this.hospitalForm
		const formData = {...form.value, ...this.accountFormGroup?.value}
		console.log(formData)
		const res = this.register.registerInitial(this.entity+'s', formData)
		res.subscribe(data => {
			const authUser = this.auth.authenticate(data['sessionToken'])
			if(!authUser) return
			this.router.navigate([authUser['user_id']], {relativeTo: this.route})
		})
	}
}
