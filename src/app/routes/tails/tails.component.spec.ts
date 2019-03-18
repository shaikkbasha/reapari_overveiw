import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ArtefactModule } from '../../shared/artefact.module';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

import { TailsComponent } from './tails.component';

describe('TailsComponent', () => {
  let component: TailsComponent;
  let fixture: ComponentFixture<TailsComponent>;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TailsComponent ],
      imports: [
        ArtefactModule,
        HttpClientModule,
        RouterTestingModule.withRoutes([])
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    router = TestBed.get(Router);
    fixture = TestBed.createComponent(TailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('isActive should be defined', () => {
    component.isActive([]);
    expect(component.isActive).toBeDefined();
  });

  it('isDropdownItemActive should be defined', () => {
    component.isDropdownItemActive([['/flights']]);
    expect(component.isDropdownItemActive).toBeDefined();
  });
});
