import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicidadeTableComponent } from './publicidade-table.component';

describe('PublicidadeTableComponent', () => {
  let component: PublicidadeTableComponent;
  let fixture: ComponentFixture<PublicidadeTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicidadeTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicidadeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
