import { Component, Input, OnInit, Type } from "@angular/core";
import { Router } from "@angular/router";
import { NgbModal, NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { HttpProviderService } from "../service/http-provider.service";
import { WebApiService } from "../service/web-api.service";
import { LoginService } from "../service/login.service";
import { CUSTOM_MODALS } from "../shared/modal/custom-modal.component";
import { HttpClient } from "@angular/common/http";
import { JsonDataService } from "src/json-data.service";

@Component({
  selector: "ng-modal-confirm",
  template: `
    <div class="modal-header">
      <h5 class="modal-title" id="modal-title">Delete Confirmation</h5>
      <button
        type="button"
        class="btn close"
        aria-label="Close button"
        aria-describedby="modal-title"
        (click)="modal.dismiss('Cross click')"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <p>Are you sure you want to delete?</p>
    </div>
    <div class="modal-footer">
      <button
        type="button"
        class="btn btn-outline-secondary"
        (click)="modal.dismiss('cancel click')"
      >
        CANCEL
      </button>
      <button
        type="button"
        ngbAutofocus
        class="btn btn-success"
        (click)="modal.close('Ok click')"
      >
        OK
      </button>
    </div>
  `,
})
export class NgModalConfirm {
  constructor(public modal: NgbActiveModal) {}
}

export const MODALS: { [name: string]: Type<any> } = {
  deleteModal: NgModalConfirm,
};

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  public showAddBatch: boolean = false;
  public matchedTables: any[] = [];
  interval: any = null;
  jsonData: any = [];
  databaseName: any;
  objectVar: any = {};
  inputScheduleId: string = "";
  scheduleIdList: any[] = [];
  tableName: string = "";
  dbName: string = "";
  closeResult = "";
  savedDataSuccess: any;
  databaseList: any = [
    {
      id: 1,
      name: "temp db",
    },
    {
      id: 2,
      name: "second db",
    },
  ];
  constructor(
    private router: Router,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private httpProvider: HttpProviderService,
    private webApiService: WebApiService,
    private service: JsonDataService,
    private http: HttpClient,
    private loginService: LoginService,
    private jsonService: JsonDataService
  ) {}
  reload() {
    this.getAlldatabase();
  }
  ngOnInit(): void {
    this.getAlldatabase();
    // this.service.getJsondata().subscribe((data) => {
    //   this.jsonData = data;
    //   return this.jsonData;
    // });
  }

  async getAlldatabase() {
    this.webApiService.get("api/showdbs").subscribe({
      next: (data) => {
        if (data != null && data.body != null) {
          var resultData = data.body;
          if (resultData) {
            this.databaseList = resultData;
          }
        }
      },
    });
  }
  getSchedulerData(scheduler: HTMLInputElement) {
    const schedulerId = scheduler.value;
    this.jsonService.getJsondata(schedulerId).subscribe((data) => {
      this.importJSONDATA(data[0]);
      this.jsonData = data;
      this.objectVar = schedulerId;
      return this.jsonData;
    });
  }
  opennConnectModal(table: any) {
    // table = "label_data2";
    // console.log(table);
    // const connectModal = this.modalService.open(CUSTOM_MODALS["customModal"], {
    //   ariaLabelledBy: "modal-basic-title",
    // });
    // connectModal.componentInstance.data = this.scheduleIdList;

    // connectModal.result.then(
    //   (obj) => {

    //   },
    //   (reason) => {}
    // );
    this.showAddBatch = true;
  }
  SaveTable(table, index) {
    // table = "label_data2";
    this.matchedTables = this.matchedTables.splice(index, 1);
    // console.log(table);
    this.connectTable(table.tableName, table);
  }
  connectTable(tableName: any, obj: any) {
    // this.interval = setInterval(() => {
    console.log(this.dbName);
    this.httpProvider.connectTable(obj.scheduleId).subscribe(
      (res) => {
        const queryParams = {
          tableName: tableName,
          dbName: obj.databaseName,
        };
        console.log(res);
        console.log(queryParams);
        this.insertData(res.body, this.jsonData, queryParams);
      },
      (err) => {
        clearInterval(this.interval);
      }
    );
    // }, 2000)
  }

  insertData(obj: any, payload: any, queryParams: any) {
    console.log(obj, payload, queryParams);
    return this.httpProvider.insertData(payload, queryParams).subscribe(
      (res) => {
        if (obj.dropdown) {
          return;
        }
        clearInterval(this.interval);
        this.httpProvider.saveScheduleId(obj.scheduleId).subscribe((res) => {
          this.savedDataSuccess = res;
          console.log(res);
          this.savedDataSuccess = Object.values(res)[1];
          this.toastr.success(`Data inserted successfully`);
          console.log(this.savedDataSuccess);
          // console.log(Object.values(this.savedDataSuccess)[1]);
          return this.savedDataSuccess;
        });
      },
      (err) => {
        clearInterval(this.interval);
      }
    );
  }

  isUserAdmin(): boolean {
    // Assuming you have a method in your LoginService to get the user's role
    return this.loginService.getUserRole() === "ADMIN";
  }
  isUser(): boolean {
    // Assuming you have a method in your LoginService to get the user's role
    return this.loginService.getUserRole() === "USER";
  }

  AddDatabase() {
    this.router.navigate(["Adddatabase"]);
  }

  deletedatabaseConfirmation(database: any) {
    this.modalService
      .open(MODALS["deleteModal"], {
        ariaLabelledBy: "modal-basic-title",
      })
      .result.then(
        (result) => {
          // console.log(database)
          this.deletedatabase(database.name);
        },
        (reason) => {}
      );
  }
  jsonInput: string = ""; // Add this property
  importingInProgress: boolean = false;

  importJSONDATA(data: any) {
    this.importingInProgress = true;

    // Assuming you have a method like importJsonData in your webApiService
    this.webApiService.importJsonData(data).subscribe(
      (response) => {
        console.log("Import JSON Response:", response);
        this.matchedTables = response.body;
        // this.tableName = response.body.tableName;
        // this.dbName = response.body.databaseName;
        // console.log(this.tableName);
        // Handle the response as needed

        // Assuming the response has tableName and databaseName properties
        if (response.body) {
          //&& response.body.tableName && response.body.databaseName
          console.log(
            `Identified Table: ${response.body
              ?.map((table) => table.tableName)
              .join()} in Database: ${response.databaseName}`
          );
          this.toastr.success(`Database match found`);
        } else {
          console.error("Invalid response format:", response);
          this.toastr.error("Table not found please ask Admin to create.");
        }

        this.importingInProgress = false;
      },
      (error) => {
        console.error("Import JSON Error:", error);
        this.toastr.error("Error during import");
        this.importingInProgress = false;
      }
    );
  }

  importJSON() {
    this.importingInProgress = true;

    // Assuming you have a method like importJsonData in your webApiService
    console.log(this.jsonData);
    this.webApiService.importJsonData(this.jsonInput).subscribe(
      (response) => {
        console.log("Import JSON Response:", response);

        // Handle the response as needed

        // Assuming the response has tableName and databaseName properties
        if (response && response.body.tableName && response.body.databaseName) {
          console.log(
            `Identified Table: ${response.body.tableName} in Database: ${response.databaseName}`
          );
          this.toastr.success(
            `Identified Table: ${response.body.tableName} in Database: ${response.body.databaseName}`
          );
        } else {
          console.error("Invalid response format:", response);
          this.toastr.error("Invalid response format");
        }

        this.importingInProgress = false;
      },
      (error) => {
        console.error("Import JSON Error:", error);
        this.toastr.error("Error during import");
        this.importingInProgress = false;
      }
    );
  }

  deletedatabase(database: any) {
    console.log(database);
    this.httpProvider.dropDatabaseByName(database).subscribe(
      (data: any) => {
        // this.toastr.success(resultData.message);

        this.getAlldatabase();
      },
      (error: any) => {}
    );
  }
}
