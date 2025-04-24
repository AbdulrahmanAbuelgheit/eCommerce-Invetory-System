import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartIconComponent } from '../../cart/cart-icon/cart-icon.component';
import { UserService } from '@app/services/user.service';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { CartService } from '@app/services/cart.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CartIconComponent, NgbDropdownModule, MatToolbarModule, MatButtonModule, MatMenuModule, MatIconModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  constructor(
    public userService:UserService,
    private cartService: CartService
  ) {}

  logout(): void {
    this.userService.logout();
    Swal.fire({
          title: 'Logged Out Successfully',
          icon: 'success',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Continue'
        });
    this.cartService.initializeCart();
      
  }

}
