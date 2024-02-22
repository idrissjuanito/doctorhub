import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationComponent } from './registration.component';
import { PersonalDetailsFormComponent } from '../components/personal-details-form/personal-details-form.component';
import { AccountFormComponent } from '../components/account-form/account-form.component';

const regRoutes: Routes = [
	{path: 'registration', component: RegistrationComponent,
	children: [
		{ path: ':type', component: AccountFormComponent },
		{ path: ':type/:id', component: PersonalDetailsFormComponent }
	]},
];

@NgModule({
  imports: [RouterModule.forChild(regRoutes)],
  exports: [RouterModule]
})
export class RegistrationRoutingModule {}
