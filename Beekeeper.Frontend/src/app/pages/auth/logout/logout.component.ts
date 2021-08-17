import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/@core/services/auth/auth.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {
  redirectDelay = 0;

  constructor(protected authService: AuthService, protected router: Router) {}

  ngOnInit(): void {
    this.logout();
  }

  logout(): void {
    this.authService.logout().then(() => {
      this.router.navigateByUrl('/');
    });
  }
}
