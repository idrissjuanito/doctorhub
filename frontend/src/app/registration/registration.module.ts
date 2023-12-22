import { NgModule, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import {MatFormFieldModule} from '@angular/material/form-field'
import {MatButtonModule} from '@angular/material/button'
import {MatSelectModule} from '@angular/material/select'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import {MatInputModule} from '@angular/material/input';
import { RegistrationComponent } from './registration.component'
import { ActivatedRoute, Router, RouterModule } from '@angular/router'
import { RegistrationRoutingModule } from './registration-routing.module'
import { ProfileComponent } from './components/profile/profile.component';
import { ChoiceComponent } from './components/choice/choice.component';
import { FinalRegComponent } from './components/final-reg/final-reg.component'

@NgModule({
  declarations: [
    RegistrationComponent,
	ProfileComponent,
	ChoiceComponent,
 	FinalRegComponent
  ],
  imports: [
    CommonModule,
	ReactiveFormsModule,
	MatFormFieldModule,
	MatSelectModule,
	MatButtonModule,
	MatInputModule,
	RegistrationRoutingModule
  ]
})
export class RegistrationModule{}
