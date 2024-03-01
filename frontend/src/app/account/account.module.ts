import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientComponent } from '../components/account/patient/patient.component';
import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from './account.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AccountSettingsComponent } from '../components/account/account-settings/account-settings.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AppModule } from '../app.module';
import { ConfirmBookingComponent } from '../components/dialogs/confirm-booking/confirm-dialog-component';



@NgModule({
  declarations: [
	AccountComponent,
    PatientComponent,
    AccountSettingsComponent,
  ],
  imports: [
    CommonModule,
	MatFormFieldModule,
	ReactiveFormsModule,
	MatSelectModule,
	MatInputModule,
	MatButtonModule,
	MatIconModule,
	MatDialogModule,
	AccountRoutingModule,
  ]
})
export class AccountModule {}
