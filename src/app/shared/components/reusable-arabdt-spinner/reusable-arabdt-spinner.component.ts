import { Component } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-spinner',
  templateUrl: './reusable-arabdt-spinner.component.html',
  styleUrls: ['./reusable-arabdt-spinner.component.scss']
})
export class ReusableArabdtSpinnerComponent {


  isLoading: boolean = false;

  show() {
    this.isLoading = true;
  }

  hide() {
    this.isLoading = false;
  }
}
