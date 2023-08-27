import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ToastrModule } from 'ngx-toastr';
import { RegisterComponent } from './register/register.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { ProfileComponent } from './profile/profile.component';
import { VideoFormatConversionComponent } from './tools/video-format-conversion/video-format-conversion/video-format-conversion.component';
import { AuthGuard } from './_services/auth.guard';
import { LiveVideoComponent } from './live-video/live-video.component';
import { ImageConverterComponent } from './image-converter/image-converter.component';
import { GenerateQRcodeComponent } from './generate-qrcode/generate-qrcode.component';
import { FashionColorsComponent } from './fashion-colors/fashion-colors.component';
import { JsontoXMLComponent } from './jsonto-xml/jsonto-xml.component';
import { JsontoHTMLComponent } from './jsonto-html/jsonto-html.component';
const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' , data: { showFooter: false } },
  { path: 'register', component: RegisterComponent, data: { showFooter: false }  },
  { path: 'welcome', component: WelcomeComponent ,canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent },
  {path: 'video-format-conversion', component: VideoFormatConversionComponent},
  {path:'live-video',component:LiveVideoComponent},
  {path:'image-converter',component: ImageConverterComponent},
  {path:'generate-qrcode',component: GenerateQRcodeComponent},
  {path:'fashion-colors',component: FashionColorsComponent},
  {path:'jsonto-xml',component: JsontoXMLComponent},
  {path:'jsonto-html', component:JsontoHTMLComponent},

  {
    path: '',
    children: [
    ]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes),
],
  exports: [RouterModule]
})
export class AppRoutingModule { }
