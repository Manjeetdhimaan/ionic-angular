import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  isLoginMode = true;

  constructor( private authService: AuthService, private router: Router ) { }

  ngOnInit() {
  }

  onLogin() {
    this.authService.login();
    this.router.navigateByUrl('/places/tabs/discover');
  }

  onLogout() {
    this.authService.logout();
  }

  onSubmit(form: NgForm) {
    console.log(form.value);
  }

  onSwitchAuthMode() {
    this.isLoginMode = !this.isLoginMode;
  }

}
