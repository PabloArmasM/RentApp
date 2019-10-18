import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProlongarComponent } from './prolongar.component';

describe('ProlongarComponent', () => {
  let component: ProlongarComponent;
  let fixture: ComponentFixture<ProlongarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProlongarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProlongarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
