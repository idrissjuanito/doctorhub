import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RegistrationModule } from './registration/registration.module';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { HomepageComponent } from './homepage/homepage.component';
import { AccountComponent } from './account/account.component';
import { LoginComponent } from './login/login.component'
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle'
import { BookingComponent } from './appointment/booking.component';
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogModule, MatDialogTitle } from '@angular/material/dialog';
import { ConfirmBookingComponent } from './components/dialogs/confirm-booking/confirm-dialog-component';
import { CreateAccountComponent } from './components/dialogs/create-account/create-account.component';
import { PersonalDetailsFormComponent } from './components/forms/personal-details-form/personal-details-form.component';
import { ProDetailsFormComponent } from './components/forms/pro-details-form/pro-details-form.component';
import { AccountDetailsFormComponent } from './components/forms/account-details-form/account-details-form.component';
import { LoginFormComponent } from './components/forms/login-form/login-form.component';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    AccountComponent,
    LoginComponent,
	BookingComponent,
	PersonalDetailsFormComponent,
	ConfirmBookingComponent,
 	CreateAccountComponent,
  	ProDetailsFormComponent,
	AccountDetailsFormComponent,
 	LoginFormComponent
  ],
  imports: [
	ReactiveFormsModule,
	MatInputModule,
	MatFormFieldModule,
	MatSelectModule,
	MatCardModule,
	MatButtonModule,
	MatGridListModule,
	MatToolbarModule,
    MatIconModule,
	MatDatepickerModule,
	MatNativeDateModule,
	MatButtonToggleModule,
	MatDialogModule,
    BrowserModule,
    BrowserAnimationsModule,
	HttpClientModule,
	RegistrationModule,
    AppRoutingModule
  ],
  providers: [
	  {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { maxWidth: "95vw", width: 500 }}
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
