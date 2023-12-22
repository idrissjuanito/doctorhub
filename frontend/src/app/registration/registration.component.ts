import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
	// constructor(private route: ActivatedRoute){}
	// ngOnInit(){
	// 	this.route.paramMap.pipe(switchMap(
	// 		params => {
	// 			console.log(params)
	// 			return 'won'
	// 		}
	// 	))
	// }
}
