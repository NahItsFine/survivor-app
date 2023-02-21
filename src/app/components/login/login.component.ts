import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService, LoginReturn } from '../../services/login.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  login_message: string | undefined;
  service_return: LoginReturn | undefined;
  hide: boolean | undefined;

  constructor(
    private router: Router,
    private loginService: LoginService
  ) { }

  ngOnInit(): void {
    this.hide = true
  }

  async onLogin(username: string, password: string) {
    // component to FE service to BE handler (to BE service to DB functions)
    const response = await this.loginService.login_user(username, password).toPromise();
    this.service_return = response;

    // if login unsuccessful, notify user and do nothing
    if (!this.service_return.login_successful) {
      this.login_message = this.service_return.message;
    }
    // if login successful, go to account page
    else if (this.service_return.login_successful) {
      this.router.navigate(['../account'], {queryParams: {username: username}});
    }

  }
  
}
