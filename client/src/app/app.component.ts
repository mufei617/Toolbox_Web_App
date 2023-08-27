import { Component } from '@angular/core';
import { CommonService } from './common.service';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'client';
 
ngOnInit() {
  
}

showFooter = true;

constructor(private router: Router, private activatedRoute: ActivatedRoute) {
  this.router.events.pipe(
    filter(event => event instanceof NavigationEnd)
  ).subscribe(() => {
    const routeData = this.getRouteData(this.activatedRoute);
    this.showFooter = routeData?.showFooter !== false;
  });
}

private getRouteData(route: ActivatedRoute): any {
  if (route.firstChild) {
    return this.getRouteData(route.firstChild);
  } else {
    return route.snapshot.data;
  }
}
}
