import { Component, OnInit } from '@angular/core';
import { User } from '../_model/users';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { LocationService } from '../_services/location.service';
import { CommonService } from '../common.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  model: any = {}
  Username: string = '';
  position: string = '';

  users: User[] = [];
  city: any;
location :any;
  constructor(private accountService: AccountService, private toastrService: ToastrService,private commonService: CommonService) { }

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    this.Username = user ? JSON.parse(user).username : null;
    this.position = user ? JSON.parse(user).role_name : null;

   this.commonService.getLocation().subscribe((response) => {
    console.log(response);
    this.location = response;
   })
  }
  changeName() {
    if (!this.model.newusername || this.model.newusername.trim() === '') {
      this.toastrService.error('enter your new username.');
      return;
    }
  
    const user = localStorage.getItem('user');
    const oldUsername = user ? JSON.parse(user).username : null;
  
    const updateModel = {
      oldUsername: oldUsername,
      newUsername: this.model.newusername.trim()
    };
  
    this.accountService.updateUsername(updateModel).subscribe({
      next: (response) => {
        console.log('Response:', response);
  
        // 更新本地存储的用户信息
        if (user) {
          const updatedUser = JSON.parse(user);
          updatedUser.username = this.model.newusername.trim();
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
  
        this.toastrService.success('name changed success');
      },
      error: (error) => {
        console.log('Error:', error);
        this.toastrService.error('change failed');
      }
    });
  }
  changePassword() {
    const user = localStorage.getItem('user');
    const username = user ? JSON.parse(user).username : null;
    console.log(username);

    if (!this.model.newpassword || this.model.newpassword.trim() === '') {
      this.toastrService.error('enter your new password.');
      return;
    }

    //加一个用户输入原密码的input

          const updatePasswordModel = {
            oldusername: username,
            oldpassword:this.model.oldpassword,
            newpassword: this.model.newpassword
          };
          console.log(updatePasswordModel)

          this.accountService.updatePassword(updatePasswordModel).subscribe({
            next: (response) => {

              console.log('Response:', response);
              this.toastrService.success('password changed success');

            },
            error: (error) => {
              this.toastrService.error('Failed to change password');
            }
          });
       
  }

  
}
