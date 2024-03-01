import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: []
})
export class AppComponent implements OnInit {
	user: string | null = null
  	title = 'frontend';
  	constructor(public auth: AuthService){}
	ngOnInit() {
		this.auth.user$.subscribe({
			next: user => this.user = user["user_id"],
			error: error => this.user = null
		})
	}
}
