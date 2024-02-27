import {Component, Inject, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle, } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BookingModel } from 'src/models/app-models';
import { AuthService } from 'src/services/auth.service';
import { BookingService } from 'src/services/booking-service';

@Component({
  selector: 'confirm-booking',
  templateUrl: 'confirm-booking-component.html',
})
export class ConfirmBookingComponent implements OnInit {
	patient!: object
  constructor(private auth: AuthService,
			  public dialogRef: MatDialogRef<ConfirmBookingComponent>,
			  private booking: BookingService,
			 @Inject(MAT_DIALOG_DATA) public data: BookingModel) {}

	ngOnInit() {
		this.patient = this.auth.getUserProfile("patient")
		// const bookingData = JSON.parse(localStorage.getItem("tempBookingData") || "")
		// this.data = bookingData
	}
	onNoClick(): void {
		this.dialogRef.close();
	}
	confirmAppointment() {
		const requestPayload = {
			notes: this.data.notes || "",
			reason: this.data.reason,
			datetime: this.data.datetime,
			patient_id: this.data.patient?.patient_id || "",
			doctor_id: this.data.doctor.doctor_id
		}
		this.booking.new(requestPayload).subscribe( response => {
			console.log(response)
			this.dialogRef.close()
		})
	}
}
