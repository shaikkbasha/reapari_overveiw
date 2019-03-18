import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RepairRemovalComponent } from './repair-removal.component';
import { ArtefactModule } from '../../../shared/artefact.module';
import {
  MatPaginatorModule, MatButtonModule, MatSortModule, MatTableModule,
  MatTabsModule, MatIconModule, MatCheckboxModule, MatProgressSpinnerModule,
  MatCardModule, MatFormFieldModule, MatInputModule,
} from '@angular/material';
import { ToastrModule } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of } from 'rxjs';
import { RemovalsService } from './../../../shared/services/repair/removals/removals.services';

describe('RepairRemovalComponent', () => {
  let component: RepairRemovalComponent;
  let fixture: ComponentFixture<RepairRemovalComponent>;
  let removalsService: RemovalsService;
  const apiData = [
    {
      'id': 1,
      'removalDate': '2019-03-14 00:00:00',
      'maintenanceStationId': 1,
      'lruPartNumberId': 1,
      'serialNumberOFF': 'A123456',
      'serialNumberON': '',
      'modDotIn': '3,19',
      'otherReasonOfRemoval': '',
      'revision': 'E3',
      'aircraftId': 271,
      'createdAt': '2019-03-14 11:19:40',
      'updatedAt': '2019-03-14 11:19:40',
      'airlineName': 'American Airlines',
      'tailSign': 'N154AA',
      'maintenanceStation': {
        'id': 1,
        'fullName': 'Test',
        'shortName': 'test',
        'locationName': 'chennai',
        'createdAt': '2019-03-14 11:17:45',
        'updatedAt': '2019-03-14 11:17:45'
      },
      'lruPartNumber': {
        'id': 1,
        'lruPartNumber': '180717-101',
        'partNumberId': 1,
        'createdAt': '2019-03-14 11:18:29',
        'updatedAt': '2019-03-14 11:18:29'
      }
    },
    {
      'id': 2,
      'removalDate': '2019-03-14 00:00:00',
      'maintenanceStationId': 1,
      'lruPartNumberId': 1,
      'serialNumberOFF': 'fsdfdsfdsf',
      'serialNumberON': '',
      'modDotIn': '3,23',
      'otherReasonOfRemoval': '',
      'revision': 'D1',
      'aircraftId': 271,
      'createdAt': '2019-03-14 12:51:43',
      'updatedAt': '2019-03-14 12:51:43',
      'airlineName': 'American Airlines',
      'tailSign': 'N154AA',
      'maintenanceStation': {
        'id': 1,
        'fullName': 'Test',
        'shortName': 'test',
        'locationName': 'chennai',
        'createdAt': '2019-03-14 11:17:45',
        'updatedAt': '2019-03-14 11:17:45'
      },
      'lruPartNumber': {
        'id': 1,
        'lruPartNumber': '180717-101',
        'partNumberId': 1,
        'createdAt': '2019-03-14 11:18:29',
        'updatedAt': '2019-03-14 11:18:29'
      }
    },
    {
      'id': 3,
      'removalDate': '2019-03-14 00:00:00',
      'maintenanceStationId': 1,
      'lruPartNumberId': 1,
      'serialNumberOFF': 'a12',
      'serialNumberON': '',
      'modDotIn': '6,26',
      'otherReasonOfRemoval': '',
      'revision': 'D4',
      'aircraftId': 301,
      'createdAt': '2019-03-14 12:53:28',
      'updatedAt': '2019-03-14 12:53:28',
      'airlineName': 'American Airlines',
      'tailSign': 'N951NN',
      'maintenanceStation': {
        'id': 1,
        'fullName': 'Test',
        'shortName': 'test',
        'locationName': 'chennai',
        'createdAt': '2019-03-14 11:17:45',
        'updatedAt': '2019-03-14 11:17:45'
      },
      'lruPartNumber': {
        'id': 1,
        'lruPartNumber': '180717-101',
        'partNumberId': 1,
        'createdAt': '2019-03-14 11:18:29',
        'updatedAt': '2019-03-14 11:18:29'
      }
    }
  ];
  const mockRemovalsService = {
    getRemovalsList(): Observable<any> {
      return Observable.of(apiData);
    }
  };
  const activatedRoute = {
    queryParams: Observable.of({
      fromDate: '2019-03-14T00:00:00Z',
      toDate: '2019-03-17T00:00:00Z'
    })
  };
  const mockRouter = {
    navigate: function(params, path) {
    }
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepairRemovalComponent ],
      imports: [
        ArtefactModule, RouterTestingModule, BrowserAnimationsModule,
        MatPaginatorModule, MatButtonModule, MatSortModule, MatTableModule,
        MatTabsModule, MatIconModule, MatCheckboxModule, MatProgressSpinnerModule,
        MatCardModule, MatFormFieldModule, MatInputModule, ToastrModule.forRoot()

      ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: Router, useValue: mockRouter },
        { provide: RemovalsService, useValue: mockRemovalsService },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepairRemovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    removalsService = TestBed.get(RemovalsService);
  });

  it('should create', () => {
    component.fromdates = '2019-03-13T00:00:00Z';
    component.fromdates = '2019-03-15T00:00:00Z';
    component.routeParams = {
      fromDate: '2019-03-13T00:00:00Z',
      toDate: '2019-03-15T00:00:00Z'
    };
    expect(component).toBeDefined();
  });

  it('should be defined getEvent', () => {
    component.getEvent({moduleName: 'Show Details', eventName: 'create'});
    expect(component.getEvent).toBeDefined();
  });

  it('should be defined removalsFilter', () => {
    component.removalsFilter('test');
    expect(component.dataSource.filter).toEqual('test');
  });

  it('should be defined getSelectedDates', () => {
    component.fromdates = '2019-03-13T00:00:00Z';
    component.todates = '2019-03-15T00:00:00Z';
    component.routeParams = {
      fromDate: null,
      toDate: '2019-03-15T00:00:00Z'
    };
    component.dataSource = {
      data: []
    };
    const spy = spyOn(removalsService, 'getRemovalsList').and.callThrough();
    const dateObj = {
      fromDate: '2019-03-14T00:00:00Z',
      toDate: '2019-03-16T00:00:00Z'
    };
    removalsService.getRemovalsList(dateObj).subscribe(res => {
      expect(spy).toHaveBeenCalled();
    });
    component.getSelectedDates({fromDate: new Date(), toDate: new Date()});
    expect(component.isLoading).toBeFalsy();
  });

  it('should be defined selectedRow', () => {
    component.selection = {
      selected: []
    };
    component.removalTableCells = {
      selectedIndex: 0,
      selectedRow: []
    };
    component.dataSource = {
      data: apiData
    };
    component.selectedRow();

    component.selection = {
      selected: [apiData[0]]
    };
    component.selectedRow();

    expect(component.selectedRow).toBeDefined();
  });

  it('should be defined getFilterDate', () => {
    component.routeParams.fromDate = '2019-03-13T00:00:00Z';
    component.routeParams.toDate = null;
    component.getFilterDate('2019-03-13T00:00:00Z', '2019-03-17T00:00:00Z');

    expect(component.getFilterDate).toBeDefined();
  });

});
