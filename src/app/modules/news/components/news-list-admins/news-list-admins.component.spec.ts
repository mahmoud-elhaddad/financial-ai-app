import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsListAdminsComponent } from './news-list-admins.component';

describe('NewsListAdminsComponent', () => {
  let component: NewsListAdminsComponent;
  let fixture: ComponentFixture<NewsListAdminsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsListAdminsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewsListAdminsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
