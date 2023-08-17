import { Component, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { Router } from '@angular/router';
import * as jwt_decode from "jwt-decode";
import { User } from '../_model/users';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CommonService } from '../common.service';
import { WeatherService } from '../_services/weather.service';
@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  loggedInUser: User | null = null;
  currentToken: string = '';
  isDropdownOpen = false;

  city: string = '';
  temperature!: number;
  weatherIcon!: string;
  rainAmount!: number;
  windSpeed!: number;
  location: any;
  weatherLocation: string = ''; // 替换为你要获取天气数据的城市

  constructor(private accountService: AccountService, private router: Router, private weatherservice: WeatherService, private commonService: CommonService) { }

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


    this.commonService.getLocation().subscribe((response) => {
      console.log(response);
      this.location = response;
      this.city = this.location?.city; // 将城市赋值给 this.city
      console.log(this.city); // 检查是否已正确赋值


      this.weatherservice.getWeather(this.city).subscribe(data => {
        console.log(data);
         // 打印第一个天气数据对象

        this.temperature = Math.round(data.main.temp);
        this.location = data.name;

        // 根据天气情况设置不同的天气图标
        const weatherCode = data.weather[0].id;
        if (weatherCode >= 200 && weatherCode < 300) {
          this.weatherIcon = "&#xf01e;"; // 雷暴
        } else if (weatherCode >= 300 && weatherCode < 600) {
          this.weatherIcon = "&#xf019;"; // 雨
        } else if (weatherCode >= 600 && weatherCode < 700) {
          this.weatherIcon = "&#xf01b;"; // 雪
        } else {
          this.weatherIcon = "&#xf00d;"; // 默认图标
        }

        // 获取雨量和风速
        this.rainAmount = 0; // 雨量属性需要根据实际数据结构调整
        this.windSpeed = data.wind.speed;
      });
    })


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
  goToProfile() {
    this.router.navigateByUrl('/profile');
  }
  goToVideoConversion() {
    this.router.navigateByUrl('/video-format-conversion');
  }
  
  goToVideolive() {
    this.router.navigateByUrl('/live-video');
  }
  gotoimageconversion() {
    this.router.navigateByUrl('/image-converter');
  }
}
