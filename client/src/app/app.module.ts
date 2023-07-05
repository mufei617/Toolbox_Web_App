import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ToastNoAnimationModule, ToastrModule } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';
import { IPasswordStrengthMeterService, PasswordStrengthMeterModule } from 'angular-password-strength-meter';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PasswordStrengthService } from './_services/password-strength.service';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RegisterComponent,
    WelcomeComponent,
    ProfileComponent
  ],
  imports: [
    FormsModule,
    ToastrModule.forRoot(), // ToastrModule added
    HttpClientModule,
    BrowserAnimationsModule, // required animations module

    BrowserModule,
    AppRoutingModule,
    PasswordStrengthMeterModule.forRoot({serviceClass: PasswordStrengthService })

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
