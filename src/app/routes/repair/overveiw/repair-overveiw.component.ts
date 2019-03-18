import { Component, OnInit, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDatepicker } from '@angular/material';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import * as moment from 'moment-timezone';
import { SelectionModel } from '@angular/cdk/collections';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { RepairRepairsStations } from './../../../shared/services/repair/repairs/repairs';
import { RepairsService } from './../../../shared/services/repair/repairs/repairs.service';
import { PickerModel } from './pickerModel';
import { DateFormatterService } from './../../../shared/services/dateFormatter/dateformatter.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-repair-overveiw',
  templateUrl: './repair-overveiw.component.html',
  styleUrls: ['./repair-overveiw.component.css']
})
export class RepairOverveiwComponent implements OnInit {
  selectedOption: string;
  isTail = true;
  LruNumberData: any = [];
  Mod: any;
  isDisabledTails = false;
  pickerModel: any = PickerModel;
  list: any = [];
  removalList: any = [];
  repairData: any = [];
  maintenancedata: any = [];
  airData: any = [];
  tailsData = [];
  ReasonData: any = [];
  serialNumber: any;
  lurNameData: any = [];
  enableSearchToolBar = false;
  enablesearchModal = false;
  displayedColumns: string[] = ['urlPartNumber', 'serialNumber', 'repairDate', 'repairStation', 'airline', 'tail'];
  dataSource: any = [];
  selection: any = new SelectionModel<RepairRepairsStations>(false, []);
  updatedTime: any;
  modalRef: any;
  isLoading = true;
  datepickFromDate: any = moment().subtract(15, 'days');
  datepickToDate: any = new Date();
  toDate: string;
  fromDate: string;
  repairLevel: string;
  modInData = [];
  modOutData = [];
  modActiveFilterMouseDown: any;
  modInActiveFilterMouseDown: any;
  modMouseDownFilter: number;
  modFilter: number;
  revisionObject = {};
  modIn1: Array<any> = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
  modDot1: Array<any> = [17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32];
  empMod: any = [];
  repairTypes: any[] = [
    {
      label: '<b> NO Falut </b> Found (NFF)',
      key: '',
      value: 1
    },
    {
      label: 'Level 1 Repair',
      key: 'Go / No Go',
      value: 2
    },
    {
      label: 'Level 2 Repair',
      key: 'SRU Swap',
      value: 3
    }
  ];
  revision: Array<any> = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K',
    'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];


  rev: Array<number> = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  actionToolBarConfig = {
    createLabel: 'Create Repair',
    moduleName: 'Create Repair',
    id: 'btn-overview',
    filterIds: {
      filterListId: 'filter-overview-list',
      filterText: 'inp-filter-overview-text'
    },
    enableSearch: false,
    enableCreate: true,
    buttonList: []
  };
  removalObj: any = {
    formObj: null,
    errorMsg: null,
    formSubmitted: false,
    loadVisible: false,
    modalRef: null,
    isFormSubmitted: false,
    isError: false,
    isDeleted: false,
    enableDelete: false,

  };
  reviewObj = {
    formObj: null,
    errorMsg: null,
    formSubmitted: false,
    modalRef: null,
    loadVisible: false,
    isFormSubmitted: false,
    isError: false,
    isDeleted: false,
    enableDelete: false
  };
  faultObj = {
    formObj: null,
    errorMsg: null,
    formSubmitted: false,
    modalRef: null,
    loadVisible: false,
    isFormSubmitted: false,
    isError: false,
    isDeleted: false,
    enableDelete: false
  };
  modObj = {
    formObj: null,
    errorMsg: null,
    formSubmitted: false,
    modalRef: null,
    isFormSubmitted: false,
    isError: false,
    isDeleted: false,
    enableDelete: false
  };
  repairObj = {
    formObj: null,
    errorMsg: null,
    formSubmitted: false,
    modalRef: null,
    loadVisible: false,
    isFormSubmitted: false,
    isError: false,
    isDeleted: false,
    enableDelete: false
  };
  createRemovalObj: any = {
    formObj: null,
    errorMsg: null,
    formSubmitted: false,
    modalRef: null,
    isFormSubmitted: false,
    isError: false,
    loadVisible: false,
    selectedRow: [],
    isDeleted: false,
    enableDelete: false,
    getSerialNumberVal: null
  };
  searchFailed = false;
  modData: any = [];
  getRemovalData = [];
  repairRevisionApi: any = [];
  allModelData = {};
  selectedRepairStation = '';
  @ViewChild('createRemovalForm') createRemovalForms: NgForm;
  @ViewChild('createRemovalModal') private createRemovalModal: TemplateRef<any>;
  @ViewChild('removalModal') private removalModal: TemplateRef<any>;
  @ViewChild('faultModal') private faultModal: TemplateRef<any>;
  @ViewChild('reviewModal') private reviewModal: TemplateRef<any>;

  @ViewChild('modModal') private modModal: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('repairModal') private repairModal: TemplateRef<any>;

  @ViewChild(MatSort) sort: MatSort;
  constructor(private formBuilder: FormBuilder, private repiarsService: RepairsService,
    public toaster: ToastrService, private dateService: DateFormatterService, config: NgbModalConfig, public modalService: NgbModal,
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }
  enableSerialInfo = false;
  ngOnInit() {
    this.getRepairList();
    this.repairList();
    this.getLruNameList();
    this.ReasonRemovalList();
    this.getRepairList();
    this.getMaintenanceStationsList();
    this.repairList();
    this.getAirline();
    this.getLruPartNumberList();
    this.searchFailed = undefined;
    this.getFilterDate(this.datepickFromDate, this.datepickToDate);
    if (!this.dataSource.data) {
      this.dataSource.data = [];
    }

    const todayDate = new Date();
    const currentDates = {
      year: null,
      month: null,
      day: null
    };
    currentDates.year = todayDate.getUTCFullYear();
    currentDates.month = todayDate.getUTCMonth() + 1;
    currentDates.day = todayDate.getUTCDate();
    this.repairObj.formObj = this.formBuilder.group({
      pickerModel: [currentDates, [Validators.required]],
      techician: ['', [Validators.required]],
      workOrder: ['', [Validators.required]],
      repairStation: ['', [Validators.required]],
      repairType: ['', [Validators.required]]

    });
    this.faultObj.formObj = this.formBuilder.group({
      remarks: ['', [Validators.required]],
    });
    this.reviewObj.formObj = this.formBuilder.group({
      repairRevision: ['', [Validators.required]],
    });
    this.modObj.formObj = this.formBuilder.group({
      repairRevision: ['', [Validators.required]],
    });
    this.removalObj.formObj = this.formBuilder.group({
      serialNumber: ['', [Validators.required]],
      repairRevision: ['', [Validators.required]],
      repairRevisionApi: ['', []],
      Revision: ['', []],
      lruSerialNumber: ['', []],
      repairRevisionNumber: ['', []]


    });
    const today = new Date();
    const currentDate = {
      year: null,
      month: null,
      day: null
    };
    currentDate.year = today.getUTCFullYear();
    currentDate.month = today.getUTCMonth() + 1;
    currentDate.day = today.getUTCDate();
    this.createRemovalObj.formObj = this.formBuilder.group({
      pickerModel: [currentDate, [Validators.required]],
      maintenanceSation: ['', [Validators.required]],
      repairAiline: ['', [Validators.required]],
      repairTail: ['', [Validators.required]],
      repairlruName: ['', [Validators.required]],
      repairlruPartNumber: ['', [Validators.required]],
      repairReasonOfRemoval: ['', [Validators.required]],
      repairRevision: ['', [Validators.required]],
      repairRevisionApi: ['', [Validators.required]],
      lruSerialNumber: ['', [Validators.required]],
      repairRevisionNumber: ['', []]
    });
    this.createRemovalObj.formObj.get('repairTail').disable();
  }
  getRepairList() {
    this.isLoading = true;
    this.dataSource.data = [];
    this.updatedTime = new Date();
    this.dataSource.paginator = this.paginator;
    this.dataSource = new MatTableDataSource<any>();
    this.dataSource.sort = this.sort;
    this.isLoading = false;
  }
  getEvent(params) {
    this.repairObj.enableDelete = false;
    if (params.moduleName === 'Create Repair') {
      if (params.eventName === 'create') {
        this.open(this.removalModal);
      }
      if (params) {
        this.enablesearchModal = true;
      }
    }
  }
  getRemovalModal(serialNo) {

    this.empMod = [];
    this.createRemovalObj.enableDelete = false;
    const today = new Date();
    const currentDate = {
      year: null,
      month: null,
      day: null
    };
    currentDate.year = today.getUTCFullYear();
    currentDate.month = today.getUTCMonth() + 1;
    currentDate.day = today.getUTCDate();

    this.createRemovalObj.formObj = this.formBuilder.group({
      pickerModel: [currentDate, [Validators.required]],
      maintenanceSation: ['', [Validators.required]],
      repairAiline: ['', [Validators.required]],
      repairTail: ['', [Validators.required]],
      repairlruName: ['', [Validators.required]],
      repairlruPartNumber: ['', [Validators.required]],
      repairReasonOfRemoval: ['', [Validators.required]],
      repairRevision: ['', [Validators.required]],
      repairRevisionApi: ['', [Validators.required]],
      lruSerialNumber: [serialNo, [Validators.required]],
      repairRevisionNumber: ['', []]
    });
    this.createRemovalObj.formObj.controls['lruSerialNumber'].setValue(serialNo);
    this.createRemovalObj.formObj.get('repairTail').disable();
    this.open(this.createRemovalModal);
  }
  getRepairModal() {
    this.repairObj.enableDelete = false;
    this.repairObj.loadVisible = true;
    this.repairObj.formSubmitted = true;
    if (this.repairObj.formObj.invalid) {
      this.repairObj.formSubmitted = false;
      this.repairObj.loadVisible = false;
    }
    const todayDate = new Date();
    const currentDates = {
      year: null,
      month: null,
      day: null
    };
    currentDates.year = todayDate.getUTCFullYear();
    currentDates.month = todayDate.getUTCMonth() + 1;
    currentDates.day = todayDate.getUTCDate();
    this.repairObj.formObj = this.formBuilder.group({
      pickerModel: [currentDates, [Validators.required]],
      techician: ['', [Validators.required]],
      workOrder: ['', [Validators.required]],
      repairStation: ['', [Validators.required]],
      repairType: ['', [Validators.required]]
    });
    this.open(this.repairModal);

  }
  getfaultModal() {
    this.faultObj.enableDelete = false;
    if (this.repairObj.formObj.valid) {
      this.repairObj.formSubmitted = true;
      const formValues = this.repairObj.formObj.value;
      if (formValues.repairType.value === 1) {
        this.open(this.faultModal);
      } else if (formValues.repairType.value === 2) {
        // alert('not created --2');
        // this.open(this.faultModal);
      } else if (formValues.repairType.value === 3) {
        // alert('not created --3');
        // this.open(this.faultModal);
      }
    }
    // this.open(this.faultModal);
  }
  getModOutModal() {
    this.modObj.enableDelete = false;
    if (this.faultObj.formObj.invalid) {
      this.faultObj.formSubmitted = true;

    } else {
      this.open(this.modModal);
    }
  }
  getReviewModal() {
    this.reviewObj.enableDelete = false;
    if (this.modObj.formObj.invalid) {
      this.modObj.formSubmitted = true;
    }

    this.list.forEach(list => {
      if (list.id === parseInt(this.repairObj.formObj.value.repairStation, 10)) {
        this.selectedRepairStation = list.fullName;
      }
    });
    const repairDates = this.repairObj.formObj.value.pickerModel;
    const dateTimes = new Date(repairDates.year + '-' + repairDates.month + '-' + repairDates.day);
    this.repairObj.formObj.value.repairDates = moment(dateTimes).format('YYYY-MM-DD HH:mm:ss');
    // else {
    // this.open(this.reviewModal);
    // }
    this.open(this.reviewModal);

  }
  getSelectedDates(data) {
    this.isLoading = true;
    if (this.dataSource) {
      this.dataSource.data = [];
    }
    this.getFilterDate(data.fromDate, data.toDate);
  }
  resetFormData() {
    this.empMod = [];
    this.repairObj.formSubmitted = false;
    this.repairObj.isFormSubmitted = false;
    this.repairObj.loadVisible = false;
    // this.repairObj.formObj.reset();
    this.faultObj.formSubmitted = false;
    this.faultObj.isFormSubmitted = false;
    // this.faultObj.formObj.reset();
    this.reviewObj.formSubmitted = false;
    this.reviewObj.isFormSubmitted = false;
    // this.reviewObj.formObj.reset();
    this.modObj.formSubmitted = false;
    this.modObj.isFormSubmitted = false;
    // this.modObj.formObj.reset();
    this.removalObj.formSubmitted = false;
    this.removalObj.isFormSubmitted = false;
    // this.removalObj.formObj.reset();
    this.selection.clear();
    this.removalObj.enableSerialInfo = false;
    this.removalObj.enableSerialInfo = false;
    this.searchFailed = false;
    this.createRemovalObj.formSubmitted = false;
    this.createRemovalObj.loadVisible = false;
    this.reviewObj.loadVisible = false;
    this.createRemovalObj.isFormSubmitted = false;
    if (this.createRemovalObj.formObj) {
      // this.createRemovalObj.formObj.reset();
    }
    this.createRemovalObj.selectedRow = [];
  }
  removalFormSubmit() {
    this.removalObj.formSubmitted = true;
    if (this.removalObj.formObj.invalid) {
      return;
    }
  }
  repairFormSubmit() {
    this.repairObj.formSubmitted = true;
    this.repairObj.loadVisible = false;
    if (this.repairObj.formObj.invalid) {
      this.repairObj.loadVisible = false;
      this.repairObj.formSubmitted = true;
      return;
    }

  }
  faultFormSubmit() {
    this.faultObj.formSubmitted = true;
    this.faultObj.loadVisible = false;
    if (this.faultObj.formObj.invalid) {
      this.faultObj.loadVisible = false;
      return;
    }
  }
  reviewFormSubmit() {
    this.reviewObj.formSubmitted = true;
    this.reviewObj.loadVisible = true;
    if (this.reviewObj.formObj.invalid) {
      this.reviewObj.loadVisible = false;
      // return;
    }
    let repairDates = this.repairObj.formObj.value.pickerModel;
    const dateTimes = new Date(repairDates.year + '-' + repairDates.month + '-' + repairDates.day);
    repairDates = moment(dateTimes).format('YYYY-MM-DD HH:mm:ss');
    let repairStationVal = '';
    this.list.forEach(element => {
      if (element.id.toString() === this.repairObj.formObj.value.repairStation.toString()) {
        repairStationVal = element;
      }
    });
    let removalDate = this.createRemovalObj.formObj.value.pickerModel;
    const dateTime = new Date(removalDate.year + '-' + removalDate.month + '-' + removalDate.day);
    removalDate = moment(dateTime).format('YYYY-MM-DD HH:mm:ss');

    const finalPostObj = {
      id: '',
      repairDate: repairDates,
      repairStationId: this.repairObj.formObj.value.repairStation,
      modDotOut: this.modOutData.toString(),
      repairTechnician: this.repairObj.formObj.value.techician,
      workOrder: this.repairObj.formObj.value.workOrder,
      noFaultFound: this.faultObj.formObj.value.remarks,
      removalId: this.allModelData['id'],
      createdAt: '',
      updatedAt: '',
      repairStation: repairStationVal,
      removal: {
        id: this.allModelData['id'],
        removalDate: this.allModelData['removalDate'],
        maintenanceStationId: this.allModelData['maintenanceStationId'],
        lruPartNumberId: this.allModelData['lruPartNumberId'],
        serialNumberOFF: this.allModelData['serialNumberOFF'],
        serialNumberON: '',
        aircraftId: this.allModelData['aircraftId'],
        modDotIn: this.allModelData['modDotIn'],
        otherReasonOfRemoval: '',
        revision: this.allModelData['revision'],
        createdAt: '',
        updatedAt: ''
      }
    };
    this.repiarsService.createRepair(finalPostObj).subscribe((data) => {
      this.repairData = data;
      if (this.repairData['modDotOut']) {
        this.modOutData = this.repairData['modDotOut'].split(',').map(i => {
          return parseInt(i, 10);
        });
      }
    });
    this.reviewObj.loadVisible = false;
  }
  modFormSubmit() {
    this.modObj.formSubmitted = true;
    if (this.modObj.formObj.invalid) {
      return;
    }
  }
  createFormSubmit() {
    this.createRemovalObj.formSubmitted = true;
    this.createRemovalObj.loadVisible = true;
    if (this.createRemovalObj.formObj.invalid) {
      this.createRemovalObj.loadVisible = false;
      return;
    }
    let removalDate = this.createRemovalObj.formObj.value.pickerModel;
    const dateTime = new Date(removalDate.year + '-' + removalDate.month + '-' + removalDate.day);
    removalDate = moment(dateTime).format('YYYY-MM-DD HH:mm:ss');

    let maintenanceSationVal = '';
    this.maintenancedata.forEach(element => {
      if (element.id.toString() === this.createRemovalObj.formObj.value.maintenanceSation.toString()) {
        maintenanceSationVal = element;
      }
    });
    let reasonOfRemovalValue = '';
    this.ReasonData.forEach(element => {
      if (element.id.toString() === this.createRemovalObj.formObj.value.repairReasonOfRemoval.toString()) {
        reasonOfRemovalValue = element;
      }
    });

    let lruPartNumberValue = '';
    this.LruNumberData.forEach(element => {
      if (element.id.toString() === this.createRemovalObj.formObj.value.repairlruPartNumber.toString()) {
        lruPartNumberValue = element;
      }
    });

    let airlineData;
    this.airData.forEach(element => {
      if ((element.icao && element.icao.toString()) === this.createRemovalObj.formObj.value.repairAiline.toString()) {
        airlineData = element;
      }
    });

    const api = this.createRemovalObj.formObj.value.repairRevisionApi;
    const getRevision = api + '' + this.createRemovalObj.formObj.value.repairRevisionNumber;

    let getTailName = '';
    this.tailsData.forEach((element) => {
      if (element.id.toString() === this.createRemovalObj.formObj.value.repairTail.toString()) {
        getTailName = element.tailNumber;
      }
    });

    const postObj = {
      removalDate: removalDate,
      maintenanceStationId: this.createRemovalObj.formObj.value.maintenanceSation,
      lruPartNumberId: this.createRemovalObj.formObj.value.repairlruPartNumber,
      serialNumberOFF: this.createRemovalObj.formObj.value.lruSerialNumber,
      serialNumberON: '',
      modDotIn: this.empMod.toString(),
      otherReasonOfRemoval: '',
      revision: getRevision,
      aircraftId: this.createRemovalObj.formObj.value.repairTail,
      createdAt: '',
      updatedAt: '',
      airlineName: airlineData.name,
      tailSign: getTailName,
      maintenanceStation: maintenanceSationVal,
      reasonOfRemoval: reasonOfRemovalValue,
      lruPartNumber: lruPartNumberValue
    };
    this.createRemovalObj.formSubmitted = true;
    this.createRemovalObj.isError = false;
    this.allModelData = postObj;

    this.repiarsService.createRemoval(postObj).subscribe((data) => {
      this.allModelData['id'] = data['id'];
      this.removalList = data;
      if (!this.removalList.error) {
        if (this.removalList['modDotIn']) {
          this.modInData = this.removalList['modDotIn'].split(',').map(i => {
            return parseInt(i, 10);
          });
          this.modOutData = this.removalList['modDotIn'].split(',').map(i => {
            return parseInt(i, 10);
          });
          if (this.removalList['modDotOut']) {
            this.modOutData = this.removalList['modDotOut'].split(',').map(i => {
              return parseInt(i, 10);
            });
          }
          this.empMod.push(...this.modInData);
        }
        let revisionObj = [];
        if (this.removalList['revision']) {
          revisionObj = this.removalList['revision'].split('');
        }
        this.removalObj.formObj.controls['repairRevisionApi'].setValue(revisionObj[0], { onlySelf: true });
        this.removalObj.formObj.controls['repairRevisionNumber'].setValue(parseInt(revisionObj[1], 10), { onlySelf: true });
        this.removalObj.enableSerialInfo = true;
        this.removalObj.isLoading = false;
        this.createRemovalObj.isLoading = true;
        this.searchFailed = false;
        if (this.removalObj.modalRef) {
          this.removalObj.modalRef.close();
        }
        if (this.createRemovalObj.formObj) {
          // this.createRemovalObj.formObj.reset();
        }
        this.createRemovalObj.formSubmitted = false;
        this.createRemovalObj.loadVisible = false;
      } else if (this.removalList.error) {
        this.createRemovalObj.isLoading = false;
        this.createRemovalObj.loadVisible = false;
        const error = this.removalList;
        this.createRemovalObj.isError = true;
        this.createRemovalObj.errorMsg = (error.error && (error.error.message || error.error.error_description)) || error.statusText;
      }
    }, error => {
      this.createRemovalObj.isError = true;
      this.createRemovalObj.errorMsg = (error.error && (error.error.message || error.error.error_description)) || error.statusText;
    });
  }
  getFilterDate(fromDate, toDate) {
    const dateObj = this.dateService.getDates(new Date(fromDate), new Date(toDate));
    this.fromDate = dateObj.fromDate;
    this.toDate = dateObj.toDate;
  }
  open(content) {
    this.removalObj.modalRef = this.modalService.open(
      content,
      { centered: true, windowClass: 'hugeModal' }
    );

  }
  closeModal() {
    this.repairObj.modalRef.close();
    this.removalObj.modalRef.close();
  }
  repairList() {
    this.repiarsService.getRepair().subscribe((data) => {
      this.list = data;
    });
  }
  getLruSerial(data) {
    this.removalObj.isLoading = true;
    this.serialNumber = data;
    this.repiarsService.getLru(this.serialNumber).subscribe(res => {
      this.allModelData = res;
      if (res['modDotIn']) {
        this.modInData = res['modDotIn'].split(',').map(i => {
          return parseInt(i, 10);
        });
        this.modOutData = res['modDotIn'].split(',').map(i => {
          return parseInt(i, 10);
        });
        this.empMod.push(...this.modInData);
        // this.modOutData.push(...this.modInData);
      }

      let revisionObj = [];
      if (res['revision']) {
        revisionObj = res['revision'].split('');
      }

      this.removalObj.formObj.controls['repairRevisionApi'].setValue(revisionObj[0], { onlySelf: true });
      this.removalObj.formObj.controls['repairRevisionNumber'].setValue(parseInt(revisionObj[1], 10), { onlySelf: true });
      if (res['error']) {
        this.searchFailed = true;
        this.removalObj.enableSerialInfo = false;
        this.removalObj.isLoading = false;

      } else {
        this.removalList = res;
        this.removalObj.enableSerialInfo = true;
        this.removalObj.formSubmitted = true;
        this.searchFailed = false;
        this.removalObj.isLoading = false;
        if (this.removalObj.formObj.invalid) {
          return;
        }
      }
    }, err => {
      this.searchFailed = true;
      this.removalObj.enableSerialInfo = false;
      this.removalObj.isLoading = false;
    });
  }
  getMaintenanceStationsList() {
    this.repiarsService.getMaintenanceStationlist().subscribe(list => {
      this.maintenancedata = list;

    });
  }
  getAirline() {
    this.repiarsService.getAirlinelist().subscribe(list => {
      this.airData = list;

    });
  }

  getLruNameList() {
    this.repiarsService.getLruName().subscribe(list => {
      this.lurNameData = list;
      this.isTail = true;

    });
  }
  getLruPartNumberList() {
    this.repiarsService.getLruPartNumber().subscribe(data => {
      this.LruNumberData = data;
    });
  }
  ReasonRemovalList() {
    this.repiarsService.ReasonRemoval().subscribe(data => {
      this.ReasonData = data;
    });
  }
  getAircraftList(id: number) {
    if (id) {
      this.repiarsService.getTails(id).subscribe(list => {
        if (!list['error']) {
          this.tailsData = list;
        } else if (list['error']) {
          this.tailsData = [];
        }
        if (id) {
          this.createRemovalObj.formObj.get('repairTail').enable();
        }
      });
    } else if (!id) {
      this.createRemovalObj.formObj.get('repairTail').disable();
      this.createRemovalObj.formObj.controls['repairTail'].setValue('');

    }
  }
  selectedBtn(id) {
    if (this.empMod.indexOf(id) === -1) {
      this.empMod.push(id);
    } else {
      const getSelectedElem = [];
      for (let i = 0; i < this.empMod.length; i++) {
        if (this.empMod[i] !== id) {
          getSelectedElem.push(this.empMod[i]);
        }
      }
      this.empMod = getSelectedElem;
      // this.modInData = getSelectedElem;

    }
    // if (this.empMod.includes(id)) {
    //   this.modFilter = id;
    // } else {
    //   this.modFilter = 0;
    // }
  }
  selectedBtnOut(id) {
    if (this.modOutData.indexOf(id) === -1) {
      this.modOutData.push(id);
    } else {
      this.modOutData.splice(this.modOutData.indexOf(id), 1);
    }
  }
  modFilterMouseDown(filter) {
    this.modMouseDownFilter = filter;
    this.modFilter === filter ? this.modActiveFilterMouseDown = true : this.modInActiveFilterMouseDown = true;
  }

  modFilterMouseUp() {
    this.modActiveFilterMouseDown = false;
    this.modInActiveFilterMouseDown = false;
  }

}