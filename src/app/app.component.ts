import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { LoginService } from './shared/services/login.service';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'employee-management';
  

  constructor(
    private loginService: LoginService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  isLoggedIn(): boolean {
    return isPlatformBrowser(this.platformId) && this.loginService.isLoggedIn();
  }

  logout(): void {
    this.loginService.logout();
    this.router.navigate(['/login']);
  }
}
