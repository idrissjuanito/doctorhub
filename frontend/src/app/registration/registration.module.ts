import { NgModule, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatButtonModule } from '@angular/material/button'
import { MatSelectModule } from '@angular/material/select'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { MatInputModule } from '@angular/material/input';
import { RegistrationComponent } from './registration.component'
import { ActivatedRoute, Router, RouterModule } from '@angular/router'
import { RegistrationRoutingModule } from './registration-routing.module'

@NgModule({
  declarations: [
    RegistrationComponent,
  ],
  imports: [
    CommonModule,
	MatFormFieldModule,
	ReactiveFormsModule,
	MatSelectModule,
	RegistrationRoutingModule
  ]
})
export class RegistrationModule{}
