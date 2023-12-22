import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
	authUser: string | null = null
	constructor(private auth: AuthService,
			   private router: Router,
			   private route: ActivatedRoute){}
	ngOnInit(){
		this.authUser = this.auth.isAuthenticated()
		!this.authUser ? this.router.navigate(['/'])
			: this.router.navigate([this.authUser], {relativeTo: this.route})
	}
}
