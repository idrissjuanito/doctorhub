import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DoctorType, UserJWTInfo } from 'src/models/app-models';
import { AuthService } from 'src/services/auth.service';
import { BookingService } from 'src/services/booking-service';
import { DataService } from 'src/services/data.service';
import { ConfirmBookingComponent } from '../components/dialogs/confirm-booking/confirm-dialog-component';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: []
})
export class BookingComponent implements OnInit {
	doctorId: string | undefined
	doctor: DoctorType | undefined
	selected: Date = new Date()
	time = new FormControl(0)
	reason = new FormControl('')
	notes = new FormControl('')
	doctorSchedule = {
		break: [13, 14],
		checkinTime: 10,
		checkoutTime: 17
	}
	slots: number[] = []

	constructor(private route: ActivatedRoute,
				private router: Router,
			   private dataservice: DataService,
			   private auth: AuthService,
			   private booking: BookingService,
			   public dialog: MatDialog){}

	ngOnInit() {
		this.doctorId = this.route.snapshot.queryParamMap.get("doctorId") || undefined
		const res = this.dataservice.fetch<{results: DoctorType}>("doctors", this.doctorId)
		res.subscribe(data => this.doctor = data["results"])
		this.getAvailableSlots()
	}

	getAvailableSlots() {
		const start = this.doctorSchedule.checkinTime
		const stop = this.doctorSchedule.checkoutTime
		for(let i = start; i <= stop; i++) {
			if(this.doctorSchedule.break.includes(i))
				continue
			this.slots.push(i)
		}
	}

	processBooking() {
		if(!this.time.value) return
		const datetime = this.selected.setUTCHours(this.time.value, 0, 0)
		const bookingData = {
			datetime: new Date(datetime).toISOString(),
			reason: this.reason.value,
			notes: this.notes.value,
			doctor: this.doctorId
		}
		const userData: UserJWTInfo | null = this.auth.isAuthenticated()
		if(userData) {
			this.dialog.open(ConfirmBookingComponent, {data: { bookingData: bookingData, userData}})
			return
		}
	}
}
