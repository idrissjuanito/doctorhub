import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, switchMap } from 'rxjs';
import { RegisterService } from 'src/services/registration.service';
import { jwtDecode } from 'jwt-decode'
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'account-details-form',
  templateUrl: './account-details-form.component.html',
  styleUrls: [],
})
export class AccountDetailsFormComponent implements OnInit {
	@Output() accountFormGroupEvent = new EventEmitter<FormGroup>()

	accountForm = new FormGroup({
		email: new FormControl(''),
		password: new FormControl(''),
		confirmPassword: new FormControl('')
	})

	constructor(private router: Router,
				private register: RegisterService,
			   	private route: ActivatedRoute,
			   	private auth: AuthService){}

	ngOnInit() {
		this.accountFormGroupEvent.emit(this.accountForm)
	}
}
