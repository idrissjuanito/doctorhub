import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, NavigationStart, Route, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: []
})
export class RegistrationComponent implements OnInit {
	type = new FormControl<string | null>(null)
	accountTypeSubsciption: Subscription | undefined
	navEnd: Observable<NavigationEnd>;
	navEndSubscription: Subscription | undefined

	constructor(private route: ActivatedRoute, private router: Router){
		this.navEnd = this.router.events.pipe(
		  filter(evt => evt instanceof NavigationEnd)
		) as Observable<NavigationEnd>;
	}
	ngOnInit() {
		this.accountTypeSubsciption = this.type.valueChanges.subscribe((route) => {
			this.router.navigate([route], {relativeTo: this.route})
		})
		this.navEndSubscription = this.navEnd.subscribe((data) => {
			if(data.url === "/registration" && this.type) this.type.setValue(null)
		});
		const type = this.route.children[0]?.snapshot.paramMap.get("type")
		if(type && !this.type.value) this.type.setValue(type)
	}

	ngOnDestroy() {
		this.accountTypeSubsciption?.unsubscribe()
		this.navEndSubscription?.unsubscribe()
	}
}
