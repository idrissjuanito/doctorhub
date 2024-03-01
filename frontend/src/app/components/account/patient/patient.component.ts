import { Component, OnInit } from '@angular/core';
import { BookingModel, IPatient, UserJWTInfo } from 'src/models/app-models';
import { BookingService } from 'src/services/booking-service';
import { ConfirmBookingComponent } from '../../dialogs/confirm-booking/confirm-dialog-component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})
export class PatientComponent implements OnInit {
	constructor(private booking: BookingService,
			   public matDialog: MatDialog,
			   private auth: AuthService) {}
	profile!: IPatient | null
	authUser!: UserJWTInfo
	ngOnInit() {
		const req = this.booking.getAppointment()
		if(req != null) {
			req.subscribe(resp => console.log(resp))
		}
		const dataString = localStorage.getItem("tempBookingData")
		if(dataString && this.auth.userData) {
			this.profile = this.auth.userData.profile
			const booking: BookingModel = JSON.parse(dataString)
			this.profile && (this.profile["email"] = this.auth.userData?.email)
			booking["patient"] = this.profile || undefined
			this.matDialog.open(ConfirmBookingComponent, { data: booking})
		}
	}
}
