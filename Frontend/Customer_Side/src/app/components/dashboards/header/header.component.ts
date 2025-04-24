import { Component } from '@angular/core';
//import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
  ],
  template: `
    <mat-toolbar class="mat-elevation-z3">
      <button class="mat-icon-button">
        <mat-icon>menu</mat-icon>
      </button>
    </mat-toolbar>
    <mat-sidenav-container>
      <mat-sidenav class="mat-elevation-z3" opened mode="side" style="width: 250px;">hello</mat-sidenav>
      <mat-sidenav-content>hi</mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  //constructor(public userService: UserService, private router: Router) {}
  constructor(private router: Router) {}

  goToAccount() {
    this.router.navigate(['/account']);
  }
}

/** <div class="user-info">
        <img [src]="userService.getCurrentUser()?.photo || 'assets/default-user.png'" 
             alt="Profile Photo" 
             class="profile-pic">
        <span class="username">{{ userService.getCurrentUser()?.name }}</span>
      </div> */
