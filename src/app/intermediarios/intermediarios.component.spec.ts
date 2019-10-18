import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntermediariosComponent } from './intermediarios.component';

describe('IntermediariosComponent', () => {
  let component: IntermediariosComponent;
  let fixture: ComponentFixture<IntermediariosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntermediariosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntermediariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
