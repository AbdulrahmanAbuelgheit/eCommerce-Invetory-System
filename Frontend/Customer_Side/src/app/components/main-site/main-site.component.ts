import { Component } from '@angular/core';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-site',
  imports: [NavbarComponent,RouterOutlet,CommonModule],
  templateUrl: './main-site.component.html',
  styleUrl: './main-site.component.scss'
})
export class MainSiteComponent {

  currentUrl: string = '';
  
  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.currentUrl = this.router.url; // Get the current URL
    });
  }

  showBanner(): boolean {
    return this.currentUrl == '/' ;
  }

}
