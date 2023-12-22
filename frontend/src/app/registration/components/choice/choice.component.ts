import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-choice',
  templateUrl: './choice.component.html',
  styleUrls: ['./choice.component.css']
})
export class ChoiceComponent {
	choices: String[] = ["doctor", "hospital"]
	choice = new FormControl<string>('', {nonNullable: true})
	constructor(private router: Router, private route: ActivatedRoute){}
	ngOnInit(){
		this.choice.valueChanges.subscribe(() => {
			const route = this.choice.value
			this.router.createUrlTree
			this.router.navigate([route], {relativeTo: this.route})
		})
	}

}
