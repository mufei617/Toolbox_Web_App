import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ToastrModule } from 'ngx-toastr';
import { RegisterComponent } from './register/register.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { ProfileComponent } from './profile/profile.component';

import { AuthGuard } from './_services/auth.guard';
const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'register', component: RegisterComponent },
  { path: 'welcome', component: WelcomeComponent ,canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent },

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
