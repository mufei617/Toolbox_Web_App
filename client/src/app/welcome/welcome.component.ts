import { Component, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { Router } from '@angular/router';
import * as jwt_decode from "jwt-decode";
import { User } from '../_model/users';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  loggedInUser: User | null = null;
  currentToken: string = '';
  isDropdownOpen = false;

  constructor(private accountService: AccountService, private router: Router) { }

  ngOnInit(): void {
    const userString = localStorage.getItem('user');
    const userToken = userString ? JSON.parse(userString).token : null;

    if (userString && userToken) {
      this.loggedInUser = JSON.parse(userString);
      this.currentToken = userToken;
      this.parseJwtToken(this.currentToken);
    } else {

      console.log(userToken, "no token...");

      // 处理本地存储中没有用户信息或令牌的情况
    }
  }
  logout() {
    this.accountService.logout();
    this.accountService.logout();
    localStorage.removeItem('user'); // 清除用户信息
    localStorage.removeItem('token'); // 清除令牌
    this.router.navigateByUrl('/');
  }

  parseJwtToken(token: string): any {
    const helper = new JwtHelperService();

    // const decodedToken = helper.decodeToken(token);

    const expirationDate = helper.getTokenExpirationDate(token);
    const isExpired = helper.isTokenExpired(token);

    // 打印解析后的 Token 数据
    if (isExpired) {
      this.logout();
    } else {
      console.log(expirationDate, "token not ezpired yet!");
    }
  }


  public toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}
