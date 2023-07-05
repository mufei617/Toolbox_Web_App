import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { User } from '../_model/users';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { ColdObservable } from 'rxjs/internal/testing/ColdObservable';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  loggedIn = false;
  model: any = {}
  public currentUserSource = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSource.asObservable();
  constructor(private accountService: AccountService, private router: Router, private toastrService: ToastrService) { }

  ngOnInit(): void {
    var currentUser = localStorage.getItem("user");
    if (currentUser != null) {
      const user: User = JSON.parse(currentUser);
      this.accountService.setCurrentUser(user);
    }
  }

  login() {
    if (this.model.password === undefined || this.model.username === undefined || this.model.password === "" || this.model.username === "" ) {
      this.toastrService.error('Username/Password required!',"",{
        positionClass:"toast-bottom-center"
      });
      return;
    }
    this.accountService.login(this.model).subscribe(result => {
      localStorage.setItem('user', JSON.stringify(result));
      this.currentUserSource.next(result);
      this.toastrService.success('login successfully!',"",{
        positionClass:"toast-bottom-center"
      });
      this.router.navigateByUrl('/welcome')

    }, (error) => {
      this.toastrService.error(error.error,"",{
        positionClass:"toast-bottom-center"
      });
      return;
    })
  }

  getCurrentUser() {
    this.accountService.currentUser$.subscribe({
      next: user => this.loggedIn = !!user,
      error: error => console.log(error)
    })
  }

  gotoRegister() {
    this.router.navigateByUrl('/register')



  }
}
