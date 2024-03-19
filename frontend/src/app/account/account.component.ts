import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AccountService } from 'src/services/account.service';
import { AuthService } from 'src/services/auth.service';
import { ConfirmBookingComponent } from '../components/dialogs/confirm-booking/confirm-dialog-component';
import { BookingModel, IUserProfile, UserJWTInfo } from 'src/models/app-models';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: []
})
export class AccountComponent implements OnInit {
	constructor(private auth: AuthService,
			   private router: Router,
			   public matDialog: MatDialog){}

	ngOnInit(){
        this.auth.user$.subscribe({
            error: err => this.router.navigate(['/'])
        })
	}
}
