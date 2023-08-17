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
import { VideoFormatConversionComponent } from './tools/video-format-conversion/video-format-conversion/video-format-conversion.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LiveVideoComponent } from './live-video/live-video.component';
import { ImageConverterComponent } from './image-converter/image-converter.component';
import { GenerateQRcodeComponent } from './generate-qrcode/generate-qrcode.component'; // Import the ReactiveFormsModule
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RegisterComponent,
    WelcomeComponent,
    ProfileComponent,
    VideoFormatConversionComponent,
    LiveVideoComponent,
    ImageConverterComponent,
    GenerateQRcodeComponent,
  ],
  imports: [
    FormsModule,
    ToastrModule.forRoot(), // ToastrModule added
    HttpClientModule,
    BrowserAnimationsModule, // required animations module
  ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    PasswordStrengthMeterModule.forRoot({serviceClass: PasswordStrengthService }),
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
