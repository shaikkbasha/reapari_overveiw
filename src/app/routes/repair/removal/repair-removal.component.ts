import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import * as moment from 'moment-timezone';
import { SelectionModel } from '@angular/cdk/collections';
import { FormBuilder } from '@angular/forms';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DateFormatterService } from './../../../shared/services/dateFormatter/dateformatter.service';
import { RemovalsService } from './../../../shared/services/repair/removals/removals.services';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'app-repair-removal',
  templateUrl: './repair-removal.component.html',
  styleUrls: ['./repair-removal.component.css']
})
export class RepairRemovalComponent implements OnInit {
  dataSource: any = [];
  selection: any = new SelectionModel<any>(false, []);
  updatedTime: any;
  isLoading = false;
  routeParams: any;
  fromdates: any = moment().subtract(2, 'days');
  todates: any = moment(new Date());
  actionToolBarConfig = {
    createLabel: '',
    moduleName: 'Removals',
    id: 'btn-list-removal',
    filterIds: {
      filterListId: 'filter-removals-list',
      filterText: 'inp-filter-removals-text'
    },
    enableSearch: true,
    enableCreate: false,
    buttonList: [
      {
        label: 'Show Details',
        icon: 'fa fa-times',
        id: 'btn-removal-details',
        eventName: 'showDetails'
      }
    ]
  };

  /**Removal Table Configuration */
  removalTableCells: any =  {
    labels: ['select', 'LRU PART NUMBER', 'SERIAL NUMBER ', 'REMOVAL DATE (UTC)', 'MAINTENANCE STATION', 'AIRLINE', 'TAIL'],
    columns: ['id', 'lruPartNo', 'serialNumberOFF', 'removalDate', 'maintenanceStations', 'airlineName', 'tailSign'],
    selectedIndex: 0
  };
  /**Removal Table Configuration */
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute, public toaster: ToastrService, config: NgbModalConfig, public modalService: NgbModal,
    private router: Router, private dateService: DateFormatterService,
    private removalsService: RemovalsService
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }
  getRemovalList() {
    this.isLoading = true;
    this.dataSource.data = [];
    const getToDate = this.todates.split('T');

    this.removalsService.getRemovalsList({fromDate: this.fromdates, toDate: getToDate[0] + 'T23:59:59Z'}).subscribe(list => {
      if (list && !list['error']) {
        for (let i = 0; i < list.length; i++) {
          list[i].lruPartNo = list[i].lruPartNumber.lruPartNumber;
          list[i].maintenanceStations = list[i].maintenanceStation.fullName;
        }
        this.dataSource = new MatTableDataSource<any>(list);
      } else {
        this.dataSource = new MatTableDataSource<any>([]);
      }
      this.updatedTime = new Date();
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.isLoading = false;
    });
  }

  ngOnInit() {
    console.log(this.route.queryParams, 'Query parasm');
    this.route.queryParams.subscribe(params => {
        this.routeParams = params;
        if (params.fromDate && params.toDate) {
          this.fromdates = params.fromDate.replace(/(^|\D)(\d)(?!\d)/g, '$10$2');
          this.todates = params.toDate.replace(/(^|\D)(\d)(?!\d)/g, '$10$2');
        }
    });
    this.getFilterDate(this.fromdates, this.todates);
  }

  selectedRow() {
    if (this.selection.selected.length === 1) {
      this.removalTableCells['selectedIndex'] = this.dataSource.data.findIndex(
        x => x.id === this.selection.selected[0].id
      );
      this.removalTableCells.selectedRow = [this.selection.selected[0]];
    } else {
      this.removalTableCells.selectedRow = this.selection.selected;
    }
  }

  getSelectedDates(data) {
    this.isLoading = true;
    if (this.dataSource) {
      this.dataSource.data = [];
    }
    this.getFilterDate(data.fromDate, data.toDate);
  }

  getDates(fromDateIn, toDateIn) {
    let fromDate;
    let toDate;
    const nowDate = (fromDateIn.getDate().toString().length === 1)
      ? '0' + fromDateIn.getDate() : fromDateIn.getDate();
    const nowToDate = (toDateIn.getDate().toString().length === 1)
      ? '0' + toDateIn.getDate() : toDateIn.getDate();
    const nowMonth = ((fromDateIn.getMonth() + 1).toString().length === 1) ?
      '0' + (fromDateIn.getMonth() + 1) : (fromDateIn.getMonth() + 1);
    const nowToMonth = ((toDateIn.getMonth() + 1).toString().length === 1) ?
      '0' + (toDateIn.getMonth() + 1) : (toDateIn.getMonth() + 1);
    fromDate = fromDateIn.getFullYear() + '-' + nowMonth + '-' + nowDate + 'T00:00:00Z';
    toDate = toDateIn.getFullYear() + '-' + nowToMonth + '-' + nowToDate + 'T00:00:00Z';
    return {
      fromDate: fromDate,
      toDate: toDate
    };
  }

  getFilterDate(fromDate, toDate) {
    const dateObj = this.getDates(new Date(fromDate), new Date(toDate));
    this.fromdates = dateObj.fromDate;
    this.todates = dateObj.toDate;
    if (!this.routeParams.fromDate && this.routeParams.toDate) {
      this.router.navigate(['repairs/removals'], { queryParams: { fromDate: this.fromdates, toDate: this.routeParams.toDate } });
    } else if (!this.routeParams.toDate && this.routeParams.fromDate) {
      this.router.navigate(['repairs/removals'], { queryParams: { fromDate: this.routeParams.fromDate, toDate: this.todates } });
    } else if ((!this.routeParams.fromDate && !this.routeParams.toDate) || this.routeParams.fromDate && this.routeParams.toDate) {
      this.router.navigate(['repairs/removals'], { queryParams: { fromDate: this.fromdates, toDate: this.todates } });
    }
    this.getRemovalList();
  }

  getEvent(params) {
    if (params.moduleName === 'Show Details') {
      if (params.eventName === 'create') {
      }
    }
  }

  removalsFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Data source defaults to lowercase matches
    this.dataSource.filter = filterValue;
    this.isLoading = false;
  }


}
