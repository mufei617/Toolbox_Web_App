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

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'register', component: RegisterComponent },
  { path: 'welcome', component: WelcomeComponent ,canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent },
  {path: 'video-format-conversion', component: VideoFormatConversionComponent},
  {path:'live-video',component:LiveVideoComponent},
  {path:'image-converter',component: ImageConverterComponent},
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
