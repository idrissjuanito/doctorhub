import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: []
})
export class AppComponent implements OnInit {
	user: string | null = null
    type: string | null = null
  	title = 'frontend';

  	constructor(public auth: AuthService){}
	ngOnInit() {
		this.auth.user$.subscribe({
			next: user => {
                console.log('user changed')
                this.user = user?.user_id ?? null
                this.type = user?.account_type ?? null
                console.log(this.user)
            },
            error: err => this.user = null
		})
        this.auth.authenticate()
	}
    logout() {
        this.auth.logout()
    }
}
