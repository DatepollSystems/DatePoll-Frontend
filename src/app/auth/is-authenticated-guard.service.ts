import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from './auth.service';

@Injectable()
export class IsAuthenticatedGuardService implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.authService.isAuthenticated('isAuthenticatedGuard')) {
      const mode = route.queryParams['mode'];
      if (mode?.includes('preview')) {
        return true;
      }
      this.router.navigate(['/home']);
      return false;
    } else {
      return true;
    }
  }
}
