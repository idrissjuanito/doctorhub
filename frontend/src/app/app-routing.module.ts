import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationComponent } from './registration/registration.component';
import { AppComponent } from './app.component';
import { HomepageComponent } from './homepage/homepage.component';
import { AccountComponent } from './account/account.component';
import { LoginComponent } from './login/login.component';
import { BookingComponent } from './appointment/booking.component';

const routes: Routes = [
	{path: '', component: HomepageComponent},
	{path: 'login', component: LoginComponent},
	{path: 'booking', component: BookingComponent},
	{path: 'registration', component: RegistrationComponent},
	{path: 'registration/:type', component: RegistrationComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
