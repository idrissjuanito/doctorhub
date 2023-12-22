import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationComponent } from './registration/registration.component';
import { AppComponent } from './app.component';
import { HomepageComponent } from './homepage/homepage.component';
import { AccountComponent } from './account/account.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
	{path: '', component: HomepageComponent},
	{path: 'login', component: LoginComponent},
	{path: 'account', component: AccountComponent, children: [
		{path: ':user_id', component: AccountComponent}
	]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
