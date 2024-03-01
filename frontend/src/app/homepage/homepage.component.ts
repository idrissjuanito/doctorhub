import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DoctorType } from 'src/models/app-models';
import { AuthService } from 'src/services/auth.service';
import { DataService } from 'src/services/data.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: []
})
export class HomepageComponent implements OnInit {
	searchTerm = new FormControl<string>('')
	doctors: DoctorType[] | null = null
	user: string | null = null
	defaultImg = "https://firebasestorage.googleapis.com/v0/b/doctohub-32c6e.appspot.com/o/Square%20Placeholder%20Image.jpg?alt=media"

	constructor(private dataservice: DataService, private auth: AuthService){}
	ngOnInit(){
		this.dataservice.fetch<{results: DoctorType[]}>('doctors').subscribe(data => {
			this.doctors = data.results
		})
		this.auth.user$.subscribe({
			next: user => this.user = user["user_id"],
			error: error => this.user = null
		})
	}

}
