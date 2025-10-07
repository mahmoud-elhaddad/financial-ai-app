import { Component } from '@angular/core';

@Component({
  selector: 'app-layout',
  standalone:false,
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
 isSideMenuVisible = false;

   handleSideMenuChange(value: boolean) {
    this.isSideMenuVisible = value;
  }
}
