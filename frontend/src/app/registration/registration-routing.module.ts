import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationComponent } from './registration.component';
import { PersonalDetailsFormComponent } from '../components/forms/personal-details-form/personal-details-form.component';
import { ProDetailsFormComponent } from '../components/forms/pro-details-form/pro-details-form.component';

const regRoutes: Routes = [
	{path: 'registration', component: RegistrationComponent,
	children: [
		{ path: ':type', component: ProDetailsFormComponent },
		{ path: ':type/:id', component: PersonalDetailsFormComponent }
	]},
];

@NgModule({
  imports: [RouterModule.forChild(regRoutes)],
  exports: [RouterModule]
})
export class RegistrationRoutingModule {}
