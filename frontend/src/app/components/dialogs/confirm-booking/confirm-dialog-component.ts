import {Component, Inject, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle, } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BookingConfirmationModel } from 'src/models/app-models';

@Component({
  selector: 'confirm-booking',
  templateUrl: 'confirm-booking-component.html',
})
export class ConfirmBookingComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<ConfirmBookingComponent>,
			 @Inject(MAT_DIALOG_DATA) public data: BookingConfirmationModel) {}

	ngOnInit() {}
	onNoClick(): void {
		this.dialogRef.close();
	}
}
