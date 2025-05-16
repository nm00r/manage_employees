import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private readonly validEmail = 'admin@example.com';
  private readonly validPassword = 'admin123';
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  login(email: string, password: string): boolean {
    if (!this.isBrowser) return false;
    
    if (email === this.validEmail && password === this.validPassword) {
      localStorage.setItem('isLoggedIn', 'true');
      return true;
    }
    return false;
  }

  isLoggedIn(): boolean {
    return this.isBrowser && localStorage.getItem('isLoggedIn') === 'true';
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('isLoggedIn');
    }
  }
}
