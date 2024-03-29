import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AccountComponent } from "./account.component";
import { PatientComponent } from "../components/account/patient/patient.component";
import { AccountSettingsComponent } from "../components/account/account-settings/account-settings.component";

const routes: Routes = [
	{path: 'account', component: AccountComponent, children: [
		{path: 'patient', component: PatientComponent},
		{path: ':type', component: AccountComponent},
		{path: ':type/settings', component: AccountSettingsComponent}
	]}
]
@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class AccountRoutingModule{}
