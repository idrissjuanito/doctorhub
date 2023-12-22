import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './components/profile/profile.component';
import { ChoiceComponent } from './components/choice/choice.component';
import { RegistrationComponent } from './registration.component';
import { FinalRegComponent } from './components/final-reg/final-reg.component';

const regRoutes: Routes = [
	{path: 'registration', component: RegistrationComponent,
	children: [
		{path: '', component: ChoiceComponent},
		{path: ':type', component: ProfileComponent},
		{path: ':type/:id', component: FinalRegComponent}
	]},
];

@NgModule({
  imports: [RouterModule.forChild(regRoutes)],
  exports: [RouterModule]
})
export class RegistrationRoutingModule {}
