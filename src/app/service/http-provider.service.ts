import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WebApiService } from './web-api.service';

var apiUrl = '';//"http://localhost:8080";

// var apiUrl = "http://192.168.10.10:105";

var httpLink = {
  getAlldatabase: apiUrl + "/api/database/getAlldatabase",
  dropDatabaseByName: apiUrl + "/api/dropDatabase",
  getdatabaseDetailByName: apiUrl + "/api/database/getdatabaseDetailByName",
  savedatabase: apiUrl + "/database/savedatabase",
  createTable: apiUrl + "/api",
  dropTableByName: apiUrl + "/api/dropTable",
 
}


// /api/{{selectedDatabas}}/table/create/manoj
@Injectable({
  providedIn: 'root'
})
export class HttpProviderService {

  constructor(private webApiService: WebApiService) { }

  public getAlldatabase(): Observable<any> {
    return this.webApiService.get(httpLink.getAlldatabase);
  }

  public dropDatabaseByName(model: any): Observable<any> {
    return this.webApiService.delete(httpLink.dropDatabaseByName + '/' + String(model));
  }

  public getdatabaseDetailByName(model: any): Observable<any> {
    return this.webApiService.get(httpLink.getdatabaseDetailByName + '?databaseId=' + model);
    // /api/database/getdatabaseDetailByName>databaseId=manoj
  }

  public savedatabase(model: any): Observable<any> {
    return this.webApiService.post(httpLink.savedatabase, model);
  }
  public dropTableByName(model: { dbName: string; tableName: string }): Observable<any> {
    const url = `${httpLink.dropTableByName}/dbName=${model.dbName}/tableName=${model.tableName}`;
    console.log(url)
    return this.webApiService.delete(url);
  }

  // public createTable(model: any): Observable<any> {
  //   return this.webApiService.post(httpLink.createTable,+'/'+ model);
  // }
  public createTable(databaseName: string, model: any): Observable<any> {
    console.log(databaseName,model)
    const apiUrl = `${httpLink.createTable}/${databaseName}/table/create`;
    return this.webApiService.post(apiUrl, model);
  }

  public fetchScheduleIdData(scheduleId: string) {

    const url = `http://localhost:8081/unattendedops.cambro.com/api/LabelData/GetLabelData/${scheduleId}`
    return this.webApiService.get(url);
  }


  insertData(payload: any, queryParams:any) {
    const url = `http://localhost:8080/mapping/insertData?dbName=${queryParams.dbName}&tableName=${queryParams.tableName}`;
    return this.webApiService.post(url, payload);
  }


  saveScheduleId(scheduleId:any) {
    const url = `http://localhost:8080/mapping/saveSchedulId?scheduleID=${scheduleId}`;
    return this.webApiService.post(url, null);
  }

  fetchAllScheduelIds() {
    const url = `http://localhost:8080/mapping/getAllScheduleId`;
    return this.webApiService.get(url);
  }

  saveDBBackup(tableName:string) {
    const url = `api/takebackup/table/${tableName}`;
    return this.webApiService.get(url);
  }

  // /api/{{selectedDatabas}}/table/create/manoj
  
  }

