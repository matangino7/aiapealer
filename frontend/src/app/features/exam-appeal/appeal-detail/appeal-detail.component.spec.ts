import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppealDetailComponent } from './appeal-detail.component';

describe('AppealDetailComponent', () => {
  let component: AppealDetailComponent;
  let fixture: ComponentFixture<AppealDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppealDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppealDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
