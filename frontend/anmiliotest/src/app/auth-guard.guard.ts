import { CanActivate, CanActivateFn, Router } from '@angular/router';
import { Injectable, inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const localData = localStorage.getItem('app_token');
  if (localData != null) {
    // router.navigateByUrl('/dashboard');
    return true;
  } else {
    router.navigateByUrl('/login');
    console.log('entro false');
    return false;
  }
};

export const authGuard2: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const localData = localStorage.getItem('app_token');
  if (localData != null) {
    router.navigateByUrl('/dashboard');
    return false;
  }

  return true;
};

// @Injectable()
// export class authGuard {
//   constructor(private router: Router) {}

//   CanActivateFn() {
//     const localData = localStorage.getItem('app_token');
//     if (localData != null) {
//       this.router.navigate(['/dashboard']);
//       return true;
//     } else {
//       this.router.navigate(['/login']);
//     }
//     return false;
//   }
// }
