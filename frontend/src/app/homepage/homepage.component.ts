import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DataService } from 'src/services/data.service';

interface DoctorType {
	first_name: string
	last_name: string
	speciality: string
	address: string
	hospital_name: string
}
@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
	searchTerm = new FormControl<string>('')
	doctors: DoctorType[] | null = null
	
	constructor(private dataservice: DataService){}
	ngOnInit(){
		this.dataservice.fetch('doctors').subscribe(data => {
			this.doctors = data.results
		})
	}
	
}
