import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();

  private apiReqs: number = 0;

  constructor() { }

  show() {
    if (this.apiReqs === 0)
      this.isLoadingSubject.next(true);

    this.apiReqs++;
  }

  hide() {
    this.apiReqs--;
    if (this.apiReqs === 0)
      this.isLoadingSubject.next(false);
  }
}

