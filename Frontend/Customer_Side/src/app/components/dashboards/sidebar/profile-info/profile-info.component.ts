import { Component, computed, Input, input, signal } from '@angular/core';

@Component({
  selector: 'app-profile-info',
  imports: [],
  templateUrl: './profile-info.component.html',
  styleUrl: './profile-info.component.scss'
})
export class ProfileInfoComponent {

  sidenavColapsed = signal(false);
  @Input() set collapsed(val:boolean) {
    this.sidenavColapsed.set(val);
  }

  profilePicSize = computed(() => this.sidenavColapsed() ? '42' : '100');
}
