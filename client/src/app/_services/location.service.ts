// 导入必要的模块
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  constructor(private http: HttpClient) {}

  getCityByIp(): Observable<string> {
    // 发起HTTP请求，使用IP定位服务获取用户所在城市
    // 你可以替换成你使用的IP定位服务API
    return this.http.get<string>('https://api.example.com/ip-location');
  }

  getCityByBrowser(): Observable<string> {
    return new Observable<string>((observer) => {
      // 使用浏览器的地理位置API获取用户所在城市
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          // 发起HTTP请求，使用经纬度获取城市信息
          // 你可以替换成你使用的地理位置服务API
          this.http
            .get<string>(`https://api.example.com/city?lat=${latitude}&lon=${longitude}`)
            .subscribe(
              (city) => observer.next(city),
              (error) => observer.error(error)
            );
        },
        (error) => observer.error(error)
      );
    });
  }
}
