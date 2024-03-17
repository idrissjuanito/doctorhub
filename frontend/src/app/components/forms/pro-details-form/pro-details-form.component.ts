import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/services/auth.service';
import { RegisterService } from 'src/services/registration.service';

@Component({
  selector: 'pro-details-form',
  templateUrl: './pro-details-form.component.html',
  styleUrls: []
})
export class ProDetailsFormComponent implements OnInit {
	type: any | null
    userId: string | undefined
	accountFormGroup: FormGroup | undefined
    userSubscription: Subscription | undefined
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
		this.type = this.route.snapshot.paramMap.get('type')
	}

	accountFormGroupInit(formGroup: any) {
		this.accountFormGroup = formGroup
	}

	submitProAccountDetails(){
		let form: FormGroup
		if (this.type == 'doctor')
			form = this.doctorForm
		else
			form = this.hospitalForm
		const formData = {...form.value, ...this.accountFormGroup?.value}
		this.register.registerInitial(this.type, formData)
	}
}
