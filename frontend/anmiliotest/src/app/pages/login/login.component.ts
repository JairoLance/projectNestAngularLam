import { HttpClient, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginObj: Login;

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.loginObj = new Login();
    this.loginObj.username = 'ingtorres1986@gmail.com';
  }

  onLogin() {
    // this.toastr.success('Hello world!', 'Toastr fun!');
    // this.toastr.success('Hello world!', 'Toastr fun!');
    // this.toastr.error('sss');
    const formData = new HttpParams()
      .set('username', this.loginObj.username)
      .set('password', this.loginObj.password);

    // Configurar las opciones de la solicitud para indicar que se enviarán datos en formato x-www-form-urlencoded
    const options = {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    };

    this.http
      .post(
        `${environment.apiURL}/api/v1/auth/login`,
        formData.toString(),
        options
      )
      .subscribe(
        (res: any) => {
          if (res.hasOwnProperty('token')) {
      
            localStorage.setItem('app_token', res.token);
            // this.router.navigateByUrl('/dashboard');
            window.location.reload();
          }
        },
        (error) => {
          if (error.error.statusCode === 401) {
            const _msn = 'Lo sentimos ' + error.error.message;
            this.toastr.error(_msn, 'Credenciales !');
          } else {
            if (error.error.hasOwnProperty('result')) {
              this.toastr.error(error.error.error, 'Problemas de entrada');
            } else {
              this.toastr.error(JSON.stringify(error), 'Problemas de entrada');
            }
          }
        }
      );
  }
}

export class Login {
  username: string;
  password: string;
  constructor() {
    this.username = '';
    this.password = '';
  }
}
