import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsListSuberAdminComponent } from './news-list-suber-admin.component';

describe('NewsListSuberAdminComponent', () => {
  let component: NewsListSuberAdminComponent;
  let fixture: ComponentFixture<NewsListSuberAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsListSuberAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewsListSuberAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
