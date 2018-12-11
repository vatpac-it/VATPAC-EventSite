import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PilotInfoComponent } from './pilot-info.component';

describe('PilotInfoComponent', () => {
  let component: PilotInfoComponent;
  let fixture: ComponentFixture<PilotInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PilotInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PilotInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
