import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PollAddFormComponent } from './poll-add-form.component';

describe('PollAddFormComponent', () => {
  let component: PollAddFormComponent;
  let fixture: ComponentFixture<PollAddFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PollAddFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PollAddFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
