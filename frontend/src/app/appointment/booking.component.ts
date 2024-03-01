import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingModel, DoctorType, IPatient, IUserProfile, UserJWTInfo } from 'src/models/app-models';
import { AuthService } from 'src/services/auth.service';
import { BookingService } from 'src/services/booking-service';
import { DataService } from 'src/services/data.service';
import { ConfirmBookingComponent } from '../components/dialogs/confirm-booking/confirm-dialog-component';
import { LoginComponent } from '../login/login.component';
import { CreateAccountComponent } from '../components/dialogs/create-account/create-account.component';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: []
})
export class BookingComponent implements OnInit {
	doctorId: string | undefined
	doctor!: DoctorType
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

	ngOnChanges() {
		console.log("something changed")
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
		const bookingData: BookingModel = {
			datetime: new Date(datetime).toISOString(),
			reason: this.reason.value || "",
			notes: this.notes.value || "",
			doctor: this.doctor
		}
		const profile = this.auth.getUserProfile()
		if(profile) {
			console.log(profile)
			profile["email"] = this.auth.userData?.email
			bookingData["patient"] = profile
			this.dialog.open(ConfirmBookingComponent, {data: bookingData})
			return
		}
		localStorage.setItem("tempBookingData", JSON.stringify(bookingData))
		this.dialog.open(CreateAccountComponent)
	}
}
